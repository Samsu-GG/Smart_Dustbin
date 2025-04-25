from rest_framework import status

from rest_framework.decorators import api_view

from rest_framework.response import Response
from .serializers import BinDataSerializer
from .models import BinData

@api_view(['POST'])
def bin_data_create(request):
    serializer = BinDataSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def bin_data_list(request):
    bin_data = BinData.objects.all()
    serializer = BinDataSerializer(bin_data, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def esp32_data(request):
    if request.method == 'POST':
        data = request.data
        print("Received data from ESP32:", data)
        return Response({"message": "Data received"}, status=status.HTTP_200_OK)
