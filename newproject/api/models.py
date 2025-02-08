from django.db import models

class Product(models.Model):
    # The product name, limited to 200 characters.
    name = models.CharField(max_length=200,default='Default Product')
    
    # A detailed description of the product.
    description = models.TextField()
    
    # The price of the product: maximum 10 digits total, with 2 decimal places.
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Stock quantity: a positive integer.
    stock = models.PositiveIntegerField(default=0)
    
    # Image field for the product.
    # - upload_to specifies the directory within MEDIA_ROOT where images will be stored.
    # - null=True means that this field can be empty in the database.
    # - blank=True allows the form to be submitted without this field.
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)

    def __str__(self):
        # Returns the product name when the object is printed.
        return self.name
