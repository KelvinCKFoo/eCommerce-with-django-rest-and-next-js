from django.urls import path
from .views import get_products,enter_product,product_detail

urlpatterns = [path('products/', get_products,name='get_products'),
               path('product/enter', enter_product, name='enter_product'),
               path('product/<int:pk>', product_detail, name='product_detail')
               
               
               
               
               ]