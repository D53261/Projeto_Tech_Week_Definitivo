package com.example.ProjetoWeekTech.services;

import com.example.ProjetoWeekTech.models.Projeto;
import com.example.ProjetoWeekTech.repository.ProjetoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjetoService {
    private final ProjetoRepository repository;

    public void salvar(Projeto projeto) { repository.save(projeto); }

    public List<Projeto> buscarTodos() { return repository.findAll(); }

    public Optional<Projeto> buscarPorId(UUID id) { return repository.findById(id); }

    public Optional<Projeto> buscarPorNomeResponsavel(String nome) { return repository.findByNomeResponsavel(nome); }

    public Optional<Projeto> buscarPorNomeProjeto(String nomeProjeto) { return repository.findByNomeProjeto(nomeProjeto); }
}
