package com.example.kkarhua.fullrest.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    
    String message() default "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, un número y una letra minúscula";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}