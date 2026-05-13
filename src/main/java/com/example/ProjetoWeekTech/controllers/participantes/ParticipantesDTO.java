package com.example.ProjetoWeekTech.controllers.participantes;

import com.example.ProjetoWeekTech.models.Participantes;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ParticipantesDTO (
        UUID id,

        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 1, max = 255, message = "O nome deve conter entre 1 e 255 caracteres")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Size(min = 1, max = 255, message = "O e-mail deve conter entre 1 e 255 caracteres")
        String email,

        @Size(min = 1, max = 10, message = "O RA deve conter entre 1 e 10 caracteres")
        String ra,

        boolean coffe,

        @Size(min = 1, max = 255, message = "O curso deve conter entre 1 e 255 caracteres")
        String curso,

        @Size(min = 1, max = 255, message = "O serie deve conter entre 1 e 255 caracteres")
        String serie
) {

    public Participantes mapear() {
        Participantes participantes = new Participantes();

        if (this.id != null) {
            participantes.setId(this.id);
        }

        participantes.setNome(this.nome);
        participantes.setEmail(this.email);
        participantes.setRa(this.ra);
        participantes.setCoffe(this.coffe);
        participantes.setCurso(this.curso);
        participantes.setSerie(this.serie);

        return participantes;
    }
}