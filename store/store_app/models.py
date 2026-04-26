# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser



class Products(models.Model):
    parent_asin = models.CharField(primary_key=True, max_length=20)
    title = models.TextField(blank=True, null=True)
    main_category = models.CharField(max_length=100, blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    store = models.CharField(max_length=100, blank=True, null=True)
    categories = models.TextField(blank=True, null=True)
    average_rating = models.FloatField(blank=True, null=True)
    rating_number = models.IntegerField(blank=True, null=True)
    features = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cb_text = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)

    @property
    def highres_image_url(self):
        if self.image_url:
            import re
            return re.sub(r'\._.*?_\.', '.', self.image_url)
        return self.image_url

    class Meta:
        managed = False
        db_table = 'products'


class Ratings(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    parent_asin = models.ForeignKey(Products, models.DO_NOTHING, db_column='parent_asin', blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    timestamp = models.BigIntegerField(blank=True, null=True)
    review_date = models.DateTimeField(blank=True, null=True)
    helpful_vote = models.IntegerField(blank=True, null=True)
    verified_purchase = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ratings'


class ReviewsText(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    parent_asin = models.ForeignKey(Products, models.DO_NOTHING, db_column='parent_asin', blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    word_count = models.IntegerField(blank=True, null=True)
    sentiment_score = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reviews_text'


class Users(models.Model):
    user_id = models.CharField(primary_key=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'users'


class AppUser(AbstractUser):
    dataset_user_id = models.CharField(max_length=50, blank=True, null=True)
    preferred_categories = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'app_users'


class History(models.Model):
    """Browsing history — max 20 entries per user, no duplicates (update_or_create)."""
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='history')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, db_column='product_asin')
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'history'
        unique_together = ('user', 'product')
        ordering = ['-viewed_at']

    def __str__(self):
        return f"{self.user} viewed {self.product_id} at {self.viewed_at}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    ]
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.pk} by {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, db_column='product_asin')
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f"{self.quantity}x {self.product_id} in Order #{self.order_id}"