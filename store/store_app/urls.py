
from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('',                                    views.index_view,                name='home'),
    path('login/',                             views.login_view,                name='login'),
    path('register/',                          views.register_view,             name='register'),
    path('logout/',                            views.logout_view,               name='logout'),
    path('onboarding/',                        views.onboarding_view,           name='onboarding'),
    
    # Product
    path('product/<str:product_id>/',          views.product_view,              name='product'),
    
    # Cart
    path('cart/',                              views.cart_view,                 name='cart'),
    path('cart/add/<str:product_id>/',         views.add_to_cart_view,          name='add_to_cart'),
    path('cart/remove/<str:product_id>/',      views.remove_from_cart_view,     name='remove_from_cart'),
    path('checkout/',                          views.checkout_view,             name='checkout'),
    
    # Favourites
    path('favourites/',                        views.favourites_view,           name='favourites'),
    path('favourites/toggle/<str:product_id>/', views.toggle_favourite_view,    name='toggle_favourite'),
    
    # Profile
    path('profile/',                           views.profile_view,              name='profile'),
    
    # Chatbot
    path('chatbot/',                           views.chatbot_view,              name='chatbot'),
    path('chatbot/send/',                      views.chatbot_send_view,         name='chatbot_send'),
]