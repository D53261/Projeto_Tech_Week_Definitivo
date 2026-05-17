package com.example.ProjetoWeekTech.controllers.participantes;

import com.example.ProjetoWeekTech.models.Participantes;
import com.example.ProjetoWeekTech.services.ParticipantesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/participantes")
@RequiredArgsConstructor
public class ParticipantesController {
    private final ParticipantesService service;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Participantes participante) {
        if (participante.getRa() != null &&
            participante.getRa().trim().isEmpty()) {
            participante.setRa(null);
        }
        try {
            Participantes salvo = service.salvar(participante);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("mensagem", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParticipantesDTO> buscarPorId(@PathVariable String id) {
        UUID idParticipante = UUID.fromString(id);
        Optional<Participantes> participanteOpcional = service.buscarPorId(idParticipante);
        if (participanteOpcional.isPresent()) {
            Participantes participantes = participanteOpcional.get();
            ParticipantesDTO dto = new ParticipantesDTO(
                    participantes.getId(),
                    participantes.getNome(),
                    participantes.getEmail(),
                    participantes.getRa(),
                    participantes.isCoffe(),
                    participantes.getCurso(),
                    participantes.getSerie()
            );
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/coffe-break")
    public ResponseEntity<?> mudarCoffeBreak(@RequestBody CoffeRequestDTO dto) {
        try {
            Optional<Participantes> participanteOpcional =
                    service.buscarPorNomeAndEmail(dto.getNome(), dto.getEmail());
            if (participanteOpcional.isPresent()) {
                Participantes participante = participanteOpcional.get();
                participante.setCoffe(true);
                service.salvar(participante);
                return ResponseEntity.ok(
                        Map.of("mensagem", "Coffee confirmado")
                );
            }
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "mensagem", "Participante não encontrado"
                    ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "mensagem", e.getMessage()
                    ));
        }
    }

    @GetMapping
    public ResponseEntity<List<ParticipantesDTO>> buscarTodos() {
        return ResponseEntity.ok(service.buscarTodos().stream().map(participantes -> new ParticipantesDTO(
                participantes.getId(),
                participantes.getNome(),
                participantes.getEmail(),
                participantes.getRa(),
                participantes.isCoffe(),
                participantes.getCurso(),
                participantes.getSerie()
        )).toList());
    }
}
