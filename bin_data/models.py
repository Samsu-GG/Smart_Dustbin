from django.db import models

class BinData(models.Model):
    distance = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Distance: {self.distance} at {self.timestamp}"
