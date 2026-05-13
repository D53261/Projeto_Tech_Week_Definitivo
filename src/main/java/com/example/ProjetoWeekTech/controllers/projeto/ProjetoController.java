package com.example.ProjetoWeekTech.controllers.projeto;

import com.example.ProjetoWeekTech.models.Projeto;
import com.example.ProjetoWeekTech.services.ProjetoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/projeto")
@RequiredArgsConstructor
public class ProjetoController {
    private final ProjetoService service;

    @CrossOrigin(origins = "*")
    @PostMapping
    public ResponseEntity<Projeto> salvar(@RequestBody @Valid Projeto projeto) {
        service.salvar(projeto);
        return ResponseEntity.ok(projeto);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/busca-id/{id}")
    public ResponseEntity<ProjetoDTO> buscarPorId(@PathVariable String id) {
        UUID idProjeto = UUID.fromString(id);
        Optional<Projeto> projetoOpcional = service.buscarPorId(idProjeto);
        if (projetoOpcional.isPresent()) {
            Projeto projeto = projetoOpcional.get();
            ProjetoDTO dto = new ProjetoDTO(
                    projeto.getId(),
                    projeto.getNomeResponsavel(),
                    projeto.getRa(),
                    projeto.getNomeProjeto(),
                    projeto.getDescricao()
            );
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/busca-nome/{nome}")
    public ResponseEntity<List<ProjetoDTO>> buscarPorNome(@PathVariable String nome) {
        String nomeProjeto = nome.trim();
        Optional<Projeto> projetoOpcional = service.buscarPorNomeResponsavel(nomeProjeto);
        if (projetoOpcional.isPresent()) {
            Projeto projeto = projetoOpcional.get();
            ProjetoDTO dto = new ProjetoDTO(
                    projeto.getId(),
                    projeto.getNomeResponsavel(),
                    projeto.getRa(),
                    projeto.getNomeProjeto(),
                    projeto.getDescricao()
            );
            return ResponseEntity.ok(List.of(dto));
        }
        return ResponseEntity.notFound().build();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/busca-projeto/{nome}")
    public ResponseEntity<List<ProjetoDTO>> buscarPorNomeProjeto(@PathVariable String nome) {
        String nomeProjeto = nome.trim();
        Optional<Projeto> projetoOpcional = service.buscarPorNomeProjeto(nomeProjeto);
        if (projetoOpcional.isPresent()) {
            Projeto projeto = projetoOpcional.get();
            ProjetoDTO dto = new ProjetoDTO(
                    projeto.getId(),
                    projeto.getNomeResponsavel(),
                    projeto.getRa(),
                    projeto.getNomeProjeto(),
                    projeto.getDescricao()
            );
            return ResponseEntity.ok(List.of(dto));
        }
        return ResponseEntity.notFound().build();
    }

    @CrossOrigin(origins = "*")
    @GetMapping
    public ResponseEntity<List<ProjetoDTO>> buscarTodos() {
        return ResponseEntity.ok(service.buscarTodos().stream().map(projeto -> new ProjetoDTO(
                projeto.getId(),
                projeto.getNomeResponsavel(),
                projeto.getRa(),
                projeto.getNomeProjeto(),
                projeto.getDescricao()
        )).toList());
    }
}
