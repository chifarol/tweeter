# Generated by Django 4.0.6 on 2022-07-28 15:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_rename_replies_tweet_reply_to'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='reply_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='replies', to='backend.tweet'),
        ),
    ]
