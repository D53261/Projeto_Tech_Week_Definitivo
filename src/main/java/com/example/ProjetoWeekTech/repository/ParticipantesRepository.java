package com.example.ProjetoWeekTech.repository;

import com.example.ProjetoWeekTech.models.Participantes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ParticipantesRepository extends JpaRepository<Participantes, UUID> {
    public Optional<Participantes> findByNome(String nome);
    Optional<Participantes> findByNomeAndEmail(String nome, String email);
    boolean existsByRa(String ra);
}
