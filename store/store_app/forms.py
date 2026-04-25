from django import forms
from django.contrib.auth import get_user_model
from .models import Products, Ratings, ReviewsText

User = get_user_model()


class ProductReviewForm(forms.ModelForm):
    rating = forms.IntegerField(min_value=1, max_value=5, widget=forms.Select(choices=[(i, f"{i} Star{'s' if i != 1 else ''}") for i in range(1, 6)]))
    text = forms.CharField(widget=forms.Textarea(attrs={'rows': 4, 'placeholder': 'Share your experience...'}), required=False)

    class Meta:
        model = ReviewsText
        fields = ['rating', 'text']


class AddToCartForm(forms.Form):
    quantity = forms.IntegerField(min_value=1, initial=1)


class CheckoutForm(forms.Form):
    full_name = forms.CharField(max_length=100)
    email = forms.EmailField()
    address = forms.CharField(max_length=255)
    city = forms.CharField(max_length=100)
    state = forms.CharField(max_length=50)
    zip_code = forms.CharField(max_length=10)
    card_number = forms.CharField(max_length=16, widget=forms.PasswordInput)
