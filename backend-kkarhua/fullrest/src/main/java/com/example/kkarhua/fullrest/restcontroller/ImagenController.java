package com.example.kkarhua.fullrest.restcontroller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.kkarhua.fullrest.entities.Producto;
import com.example.kkarhua.fullrest.services.FileStorageService;
import com.example.kkarhua.fullrest.services.ProductoServices;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Tag(name = "Imágenes", description = "Gestión de imágenes de productos")
@RestController
@RequestMapping("api/imagenes")
public class ImagenController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ProductoServices productoServices;

    @Operation(summary = "Subir imagen de producto", description = "Sube una imagen y la asocia a un producto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imagen subida correctamente"),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
        @ApiResponse(responseCode = "400", description = "Archivo inválido")
    })
    @PostMapping(value = "/upload/{productoId}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadImage(@PathVariable Long productoId,
                                        @RequestParam("file") MultipartFile file) {
        try {
            Optional<Producto> productoOptional = productoServices.findById(productoId);
            if (!productoOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            if (file.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "El archivo está vacío");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Solo se permiten archivos de imagen");
                return ResponseEntity.badRequest().body(response);
            }

            // Eliminar imagen anterior si existe
            Producto producto = productoOptional.get();
            if (producto.getImagen() != null && !producto.getImagen().isEmpty()) {
                try {
                    fileStorageService.deleteFile(producto.getImagen());
                } catch (Exception e) {
                    // Log pero continuar
                }
            }

            // Guardar nueva imagen
            String fileName = fileStorageService.storeFile(file);
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/imagenes/")
                    .path(fileName)
                    .toUriString();

            // Actualizar producto
            producto.setImagen(fileName);
            productoServices.save(producto);

            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("fileDownloadUri", fileDownloadUri);
            response.put("fileType", file.getContentType());
            response.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "No se pudo subir el archivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Operation(summary = "Obtener imagen", description = "Descarga una imagen por su nombre")
    @ApiResponse(responseCode = "200", description = "Imagen encontrada")
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFileStorageLocation().resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar imagen de producto", description = "Elimina la imagen asociada a un producto")
    @ApiResponse(responseCode = "200", description = "Imagen eliminada correctamente")
    @DeleteMapping("/{productoId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long productoId) {
        Optional<Producto> productoOptional = productoServices.findById(productoId);
        if (!productoOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Producto producto = productoOptional.get();
        if (producto.getImagen() != null && !producto.getImagen().isEmpty()) {
            try {
                fileStorageService.deleteFile(producto.getImagen());
                producto.setImagen(null);
                productoServices.save(producto);
                
                Map<String, String> response = new HashMap<>();
                response.put("message", "Imagen eliminada correctamente");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "No se pudo eliminar la imagen: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "El producto no tiene imagen");
        return ResponseEntity.ok(response);
    }
}