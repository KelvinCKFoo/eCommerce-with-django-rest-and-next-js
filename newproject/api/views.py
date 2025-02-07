from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializer import ProductSerializer

@api_view(['GET'])
def get_products(request):
    users = Product.objects.all()
    serializer = ProductSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def enter_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)