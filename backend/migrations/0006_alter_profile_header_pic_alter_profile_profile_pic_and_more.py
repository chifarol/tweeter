# Generated by Django 4.0.6 on 2022-07-31 14:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0005_alter_tweet_reply_to'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='header_pic',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='profile_pic',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='image',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]