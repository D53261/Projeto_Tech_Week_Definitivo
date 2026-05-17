package com.example.ProjetoWeekTech.services;

import com.example.ProjetoWeekTech.models.Participantes;
import com.example.ProjetoWeekTech.repository.ParticipantesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParticipantesService {
    private final ParticipantesRepository repository;

    public Participantes salvar(Participantes participante) {
        if (repository.existsByRa(participante.getRa())) {
            throw new RuntimeException("RA já cadastrado");
        }
        return repository.save(participante);
    }

    public Participantes atualizar(Participantes participante) {
        return repository.save(participante);
    }

    public Optional<Participantes> buscarPorId(UUID id) {
        return repository.findById(id);
    }

    public List<Participantes> buscarTodos() {
        return repository.findAll();
    }

    public Optional<Participantes> buscarPorNome(String nome) { return repository.findByNome(nome); }

    public Optional<Participantes> buscarPorNomeAndEmail(String nome, String email) { return repository.findByNomeAndEmail(nome, email); }
}
