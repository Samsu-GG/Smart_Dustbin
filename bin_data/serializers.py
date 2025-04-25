from rest_framework import serializers
from .models import BinData

class BinDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinData
        fields = ['id', 'distance', 'timestamp']
