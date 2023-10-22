package com.troikap.pushnotification;

import static android.content.ContentValues.TAG;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;


import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.troikap.pushnotification.MainActivity;
import com.troikap.pushnotification.R;

import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import androidx.core.app.ActivityCompat;
import android.Manifest;
import android.content.pm.PackageManager;

public class FirebasePushNotificationService extends FirebaseMessagingService {

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    Log.d(TAG, "From: " + remoteMessage.getFrom());
    Log.d(TAG, "Message Notification Body: " + remoteMessage.getData());
    Map<String, String> data = remoteMessage.getData();
    String title = data.get("title");
    String message = data.get("body");
    String pictureUrl = data.get("image");
    String contentAction = data.get("contentAction");
    String contentSref = data.get("contentSref");
    String contentParams = data.get("contentParams");
    this.showNotification(title, message, pictureUrl, contentAction, contentSref, contentParams);
    PushNotificationsPlugin.sendRemoteMessage(remoteMessage);
  }

  private void showNotification(String title, String message, String pictureUrl, String contentAction, String contentSref, String contentParams) {
    Log.d(TAG, "title: " + title);
    Log.d(TAG, "message: " + message);
    Log.d(TAG, "pictureUrl: " + pictureUrl);
    Log.d(TAG, "contentAction: " + contentAction);
    Log.d(TAG, "contentSref: " + contentSref);
    Log.d(TAG, "contentParams: " + contentParams);
    String channel = "channelId1234";
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel1 = new NotificationChannel(
        "channelId1234",
        "REDMAS OFICIAL",
        NotificationManager.IMPORTANCE_HIGH
      );
      channel1.setDescription("Notification channel");
      NotificationManager notificationManager = getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel1);
    }
    Intent intent = new Intent(this, MainActivity.class);
    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
    int flags = PendingIntent.FLAG_ONE_SHOT;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      flags = PendingIntent.FLAG_MUTABLE;
    }

    Bundle extras = new Bundle();
    JSONObject customData = new JSONObject();
    if(contentAction != null) extras.putString("contentAction", contentAction);
    if(contentSref != null) extras.putString("contentSref", contentSref);
    if(contentParams != null) extras.putString("contentParams", contentParams);

    PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, flags);
    NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channel)
      .setSmallIcon(R.drawable.notification_icon)
      .setContentTitle(title)
      .setContentText(message)
      .addExtras(extras)
      .setContentIntent(pendingIntent)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setCategory(NotificationCompat.CATEGORY_MESSAGE)
      .setAutoCancel(true);
    if (pictureUrl != null && pictureUrl.length() > 0) {
     // Download image if url exists
     try {
       URL url = new URL(pictureUrl);
       HttpURLConnection connection = (HttpURLConnection) url.openConnection();
       connection.setDoInput(true);
       connection.connect();
       InputStream in = connection.getInputStream();
       Bitmap bitmapImage = BitmapFactory.decodeStream(in);
       builder.setStyle(new NotificationCompat.BigPictureStyle()
         .bigPicture(bitmapImage));
     } catch (Exception e) {
       Log.d("ERROR", "FirebasePushNotificationService - ShowNotification ERROR");
       e.printStackTrace();
     }
    }
    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
     return;
    }
    NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);
    notificationManagerCompat.notify(0, builder.build());
  }

}
