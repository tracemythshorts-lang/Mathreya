import 'package:flutter/foundation.dart';

enum LifeStage {
  puberty,
  pregnancyPrenatal,
  pregnancyPostnatal,
  virtualMother,
  husbandDashboard,
}

class UserProfile {
  final String name;
  final String email;
  final String phone;
  final int age;
  final LifeStage stage;
  final bool faceAuthEnabled;
  final bool isAuthenticated;
  final int pregnancyWeek;
  final String emergencyContactName;
  final String emergencyContactPhone;
  final String location;

  UserProfile({
    required this.name,
    required this.email,
    required this.phone,
    required this.age,
    required this.stage,
    required this.faceAuthEnabled,
    required this.isAuthenticated,
    required this.pregnancyWeek,
    required this.emergencyContactName,
    required this.emergencyContactPhone,
    required this.location,
  });

  UserProfile copyWith({
    String? name,
    String? email,
    String? phone,
    int? age,
    LifeStage? stage,
    bool? faceAuthEnabled,
    bool? isAuthenticated,
    int? pregnancyWeek,
    String? emergencyContactName,
    String? emergencyContactPhone,
    String? location,
  }) {
    return UserProfile(
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      age: age ?? this.age,
      stage: stage ?? this.stage,
      faceAuthEnabled: faceAuthEnabled ?? this.faceAuthEnabled,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      pregnancyWeek: pregnancyWeek ?? this.pregnancyWeek,
      emergencyContactName: emergencyContactName ?? this.emergencyContactName,
      emergencyContactPhone: emergencyContactPhone ?? this.emergencyContactPhone,
      location: location ?? this.location,
    );
  }
}

class AyurvedicRemedy {
  final String title;
  final String ailment;
  final String ingredients;
  final String preparation;

  const AyurvedicRemedy({
    required this.title,
    required this.ailment,
    required this.ingredients,
    required this.preparation,
  });
}

class HusbandTask {
  final String id;
  final String title;
  final String category;
  final String dueDate;
  bool isCompleted;

  HusbandTask({
    required this.id,
    required this.title,
    required this.category,
    required this.dueDate,
    this.isCompleted = false,
  });
}
