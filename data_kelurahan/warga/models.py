from django.db import models

# Create your models here.

class Warga(models.Model):
    nik = models.CharField(max_length=16, unique=True, verbose_name="Nomor Induk Kependudukan")
    nama_lengkap = models.CharField(max_length=100, verbose_name="Nama Lengkap")
    alamat = models.TextField(verbose_name="Alamat Tinggal")
    no_telepon = models.CharField(max_length=15, blank=True, verbose_name="Nomor Telepon")
    tanggal_registrasi = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.nama_lengkap

