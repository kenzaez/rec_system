import json
import uuid
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Products, Ratings, ReviewsText, Users
from .models import AppUser
from .ml_service import get_svd_recommendations
from django.db.models import Case, When, IntegerField
from django.core.paginator import Paginator

# ─────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('index')

    if request.method == 'POST':
        email    = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')

        try:
            user_obj = AppUser.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
        except AppUser.DoesNotExist:
            user = None

        if user is not None:
            login(request, user)
            if not user.dataset_user_id:
                return redirect('onboarding')
            return redirect('index')
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'login.html')


def register_view(request):
    if request.user.is_authenticated:
        return redirect('index')

    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name  = request.POST.get('last_name', '').strip()
        email      = request.POST.get('email', '').strip()
        password   = request.POST.get('password', '')
        password2  = request.POST.get('password2', '')

        if password != password2:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'register.html')

        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters.')
            return render(request, 'register.html')

        if AppUser.objects.filter(email=email).exists():
            messages.error(request, 'An account with this email already exists.')
            return render(request, 'register.html')

        user = AppUser.objects.create_user(
            username   = email,
            email      = email,
            password   = password,
            first_name = first_name,
            last_name  = last_name,
        )
        login(request, user)
        return redirect('onboarding')

    return render(request, 'register.html')


def logout_view(request):
    logout(request)
    return redirect('login')


# ─────────────────────────────────────────────
# ONBOARDING
# ─────────────────────────────────────────────

@login_required
def onboarding_view(request):

    if request.method == 'POST':
        raw = request.POST.get('ratings', '{}')
        try:
            ratings_data = json.loads(raw)
        except json.JSONDecodeError:
            messages.error(request, 'Something went wrong, please try again.')
            return redirect('onboarding')

        if len(ratings_data) < 3:
            messages.error(request, 'Please rate at least 3 products.')
            return redirect('onboarding')

        new_user_id = 'USR_' + str(uuid.uuid4()).replace('-', '')[:16].upper()

        Users.objects.get_or_create(user_id=new_user_id)

        request.user.dataset_user_id = new_user_id
        request.user.save()

        for asin, rating in ratings_data.items():
            try:
                product = Products.objects.get(parent_asin=asin)
                user_obj = Users.objects.get(user_id=new_user_id)
                Ratings.objects.create(
                    user       = user_obj,
                    parent_asin = product,
                    rating     = float(rating),
                )
            except Products.DoesNotExist:
                continue

        return redirect('index')

    products = Products.objects.exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    ).order_by('-rating_number')[:20]

    return render(request, 'onboarding.html', {'products': products})


# ─────────────────────────────────────────────
# INDEX (placeholder)
# ─────────────────────────────────────────────

@login_required
def index_view(request):
    dataset_user_id = request.user.dataset_user_id
    
    queryset = Products.objects.exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    )
    
    if dataset_user_id:
        recommended_asins = get_svd_recommendations(dataset_user_id, n=20)
        if recommended_asins:
            # Order by recommendation first, then by rating_number
            preserved = Case(*[When(parent_asin=asin, then=pos) for pos, asin in enumerate(recommended_asins)], default=len(recommended_asins), output_field=IntegerField())
            queryset = queryset.annotate(reco_order=preserved).order_by('reco_order', '-rating_number')
        else:
            queryset = queryset.order_by('-rating_number')
    else:
        queryset = queryset.order_by('-rating_number')

    # Pagination
    paginator = Paginator(queryset, 20)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    context = {
        'products': page_obj.object_list,
        'has_next_page': page_obj.has_next(),
        'next_page': page_obj.next_page_number() if page_obj.has_next() else None,
        'products_count': paginator.count,
    }

    return render(request, 'index.html', context)


# ─────────────────────────────────────────────
# PRODUCT DETAIL
# ─────────────────────────────────────────────

@login_required
def product_view(request, product_id):
    try:
        product = Products.objects.get(parent_asin=product_id)
    except Products.DoesNotExist:
        messages.error(request, 'Product not found.')
        return redirect('index')
    
    # Get similar products (by category)
    similar_products = Products.objects.exclude(
        parent_asin=product_id
    ).exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    ).order_by('-rating_number')[:4]
    
    context = {
        'product': product,
        'similar_products': similar_products,
    }
    
    return render(request, 'product.html', context)


# ─────────────────────────────────────────────
# CART
# ─────────────────────────────────────────────

@login_required
def cart_view(request):
    # Get cart from session
    cart = request.session.get('cart', {})
    cart_items = []
    subtotal = 0
    
    for product_id, quantity in cart.items():
        try:
            product = Products.objects.get(parent_asin=product_id)
            item_total = product.price * quantity
            subtotal += item_total
            cart_items.append({
                'product': product,
                'quantity': quantity,
                'total': item_total,
            })
        except Products.DoesNotExist:
            continue
    
    shipping_total = 0 if subtotal > 50 else 5
    total = subtotal + shipping_total
    
    context = {
        'cart_items': cart_items,
        'subtotal': subtotal,
        'shipping_total': shipping_total,
        'total': total,
    }
    
    return render(request, 'cart.html', context)


@login_required
def add_to_cart_view(request, product_id):
    if request.method == 'POST':
        cart = request.session.get('cart', {})
        cart[product_id] = cart.get(product_id, 0) + 1
        request.session['cart'] = cart
        messages.success(request, 'Product added to cart.')
    
    return redirect('cart')


@login_required
def remove_from_cart_view(request, product_id):
    if request.method == 'POST':
        cart = request.session.get('cart', {})
        if product_id in cart:
            del cart[product_id]
            request.session['cart'] = cart
            messages.success(request, 'Product removed from cart.')
    
    return redirect('cart')


@login_required
def checkout_view(request):
    if request.method == 'POST':
        cart = request.session.get('cart', {})
        if not cart:
            messages.error(request, 'Your cart is empty.')
            return redirect('cart')
        
        # Process checkout
        request.session['cart'] = {}
        messages.success(request, 'Order placed successfully!')
        return redirect('index')
    
    return render(request, 'checkout.html')


# ─────────────────────────────────────────────
# FAVOURITES
# ─────────────────────────────────────────────

@login_required
def favourites_view(request):
    favourites = request.session.get('favourites', [])
    favourite_products = Products.objects.filter(
        parent_asin__in=favourites
    ).exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    )
    
    context = {
        'favourite_products': favourite_products,
    }
    
    return render(request, 'favourites.html', context)


@login_required
def toggle_favourite_view(request, product_id):
    if request.method == 'POST':
        favourites = request.session.get('favourites', [])
        
        if product_id in favourites:
            favourites.remove(product_id)
            messages.success(request, 'Removed from favourites.')
        else:
            favourites.append(product_id)
            messages.success(request, 'Added to favourites.')
        
        request.session['favourites'] = favourites
    
    return redirect('favourites')


# ─────────────────────────────────────────────
# PROFILE
# ─────────────────────────────────────────────

@login_required
def profile_view(request):
    user = request.user
    
    # Get user reviews
    try:
        user_obj = Users.objects.get(user_id=user.dataset_user_id)
        user_reviews = ReviewsText.objects.filter(user=user_obj)
        user_ratings = Ratings.objects.filter(user=user_obj)
    except:
        user_reviews = []
        user_ratings = []
    
    # Get recommended products
    dataset_user_id = user.dataset_user_id
    recommended_products = []
    if dataset_user_id:
        recommended_asins = get_svd_recommendations(dataset_user_id, n=6)
        if recommended_asins:
            recommended_products = Products.objects.filter(
                parent_asin__in=recommended_asins
            ).exclude(
                image_url__isnull=True
            ).exclude(
                image_url__exact=''
            )
    
    # Get wishlist
    favourites = request.session.get('favourites', [])
    wishlist_products = Products.objects.filter(
        parent_asin__in=favourites
    ).exclude(
        image_url__isnull=True
    ).exclude(
        image_url__exact=''
    )
    
    context = {
        'favourites_count': len(favourites),
        'reviews_count': user_reviews.count(),
        'recommended_products': recommended_products,
        'wishlist_products': wishlist_products,
        'user_reviews': user_reviews,
        'viewing_history': user_ratings[:10],
    }
    
    return render(request, 'profile.html', context)


# ─────────────────────────────────────────────
# CHATBOT
# ─────────────────────────────────────────────

@login_required
def chatbot_view(request):
    chat_history = request.session.get('chat_history', [])
    
    context = {
        'chat_history': chat_history,
    }
        
    return render(request, 'chatbot.html', context)


@login_required
def chatbot_send_view(request):
    if request.method == 'POST':
        message = request.POST.get('message', '').strip()
        
        if message:
            chat_history = request.session.get('chat_history', [])
            chat_history.append({'role': 'user', 'text': message})
            
            # Simple bot response
            bot_response = "Thanks for your message! How can I help you further?"
            chat_history.append({'role': 'bot', 'text': bot_response})
            
            request.session['chat_history'] = chat_history
    
    return redirect('chatbot')