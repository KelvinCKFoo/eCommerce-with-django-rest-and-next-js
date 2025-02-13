from django.urls import path
from .views import get_products,enter_product,product_detail,login_view,logout_view

urlpatterns = [path('products/', get_products,name='get_products'),
               path('products/enter/', enter_product, name='enter_product'),
               path('products/<int:pk>/', product_detail, name='product_detail'),
               path('login/', login_view, name='login'),
               path('logout/', logout_view, name='logout'),
               
               
               ]