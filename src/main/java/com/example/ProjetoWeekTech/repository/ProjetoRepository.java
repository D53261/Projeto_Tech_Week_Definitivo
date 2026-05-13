package com.example.ProjetoWeekTech.repository;

import com.example.ProjetoWeekTech.models.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProjetoRepository extends JpaRepository<Projeto, UUID> {
    public Optional<Projeto> findByNomeResponsavel(String nomeResponsavel);
    public Optional<Projeto> findByNomeProjeto(String nomeProjeto);
}
