package com.example.kkarhua.fullrest.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    // Patrones para validar cada requisito
    private static final Pattern HAS_UPPERCASE = Pattern.compile(".*[A-Z].*");
    private static final Pattern HAS_LOWERCASE = Pattern.compile(".*[a-z].*");
    private static final Pattern HAS_NUMBER = Pattern.compile(".*[0-9].*");
    private static final Pattern MIN_LENGTH = Pattern.compile(".{8,}");

    @Override
    public void initialize(ValidPassword constraintAnnotation) {
        // Inicialización si es necesaria
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isEmpty()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("La contraseña no puede estar vacía")
                   .addConstraintViolation();
            return false;
        }

        // Verificar si es una contraseña ya encriptada (BCrypt)
        if (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) {
            // Si ya está encriptada, la consideramos válida
            return true;
        }

        // Construir mensaje específico según lo que falta
        StringBuilder errorMessage = new StringBuilder("La contraseña debe contener: ");
        boolean isValid = true;

        if (!MIN_LENGTH.matcher(password).matches()) {
            errorMessage.append("mínimo 8 caracteres, ");
            isValid = false;
        }
        
        if (!HAS_UPPERCASE.matcher(password).matches()) {
            errorMessage.append("al menos una letra mayúscula, ");
            isValid = false;
        }
        
        if (!HAS_LOWERCASE.matcher(password).matches()) {
            errorMessage.append("al menos una letra minúscula, ");
            isValid = false;
        }
        
        if (!HAS_NUMBER.matcher(password).matches()) {
            errorMessage.append("al menos un número, ");
            isValid = false;
        }

        if (!isValid) {
            // Eliminar la última coma y espacio
            String finalMessage = errorMessage.substring(0, errorMessage.length() - 2);
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(finalMessage)
                   .addConstraintViolation();
        }

        return isValid;
    }
}