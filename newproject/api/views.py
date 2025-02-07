from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializer import ProductSerializer

@api_view(['GET'])
def get_product(request):
    return Response(ProductSerializer({'title': 'Product 1', 'description': 'Product 1 description',\
                                        'price': 100}).data, status=status.HTTP_200_OK)
