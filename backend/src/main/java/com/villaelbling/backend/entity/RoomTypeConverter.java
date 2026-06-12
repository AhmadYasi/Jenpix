package com.villaelbling.backend.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoomTypeConverter implements AttributeConverter<RoomType, String> {

    @Override
    public String convertToDatabaseColumn(RoomType attribute) {
        if (attribute == null) return null;
        return attribute == RoomType.double_ ? "double" : attribute.name();
    }

    @Override
    public RoomType convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return switch (dbData) {
            case "double" -> RoomType.double_;
            case "suite"  -> RoomType.suite;
            case "single" -> RoomType.single;
            case "family" -> RoomType.family;
            default -> throw new IllegalArgumentException("Unknown room type: " + dbData);
        };
    }
}
