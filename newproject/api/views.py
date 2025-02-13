from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializer import ProductSerializer
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt

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

@api_view(['GET','PUT','DELETE'])
def product_detail(request,pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProductSerializer(product,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




@csrf_exempt
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        if user.is_staff:
            login(request, user)
            response = JsonResponse({'is_staff': True, 'message': 'Login successful'})
            # Use 'localhost' consistently; secure is False for HTTP development.
            response.set_cookie(
                'authToken',
                'test_staff_token',  # Replace with your token generation logic
                path='/',
                httponly=True,
                
                secure=False  # Must be False if not using HTTPS
            )
            return response
        else:
            return JsonResponse(
                {'is_staff': False, 'message': 'Access denied: not a staff member'},
                status=status.HTTP_403_FORBIDDEN
            )
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)






@csrf_exempt
@api_view(['POST'])
def logout_view(request):
    print("Logout view called, method:", request.method)  # Debug log
    logout(request)
    response = JsonResponse({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    # Delete the authToken cookie; adjust parameters if necessary.
    response.delete_cookie('authToken', path='/')
    print("Cookie deletion attempted")  # Debug log
    return response
