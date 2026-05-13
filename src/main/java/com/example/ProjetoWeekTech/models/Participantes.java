package com.example.ProjetoWeekTech.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "participantes")
@Data
@ToString
public class Participantes {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "ra", unique = true)
    private String ra;

    @Column(name = "coffe_break", nullable = false)
    private boolean coffe;

    @Column(name = "curso")
    private String curso;

    @Column(name = "serie")
    private String serie;

    @CreationTimestamp
    @Column(name = "data_inscricao", nullable = false)
    private LocalDateTime data_inscricao;
}
