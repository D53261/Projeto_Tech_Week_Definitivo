package com.example.ProjetoWeekTech.controllers.projeto;

import com.example.ProjetoWeekTech.models.Projeto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ProjetoDTO(
        UUID id,

        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 1, max = 255, message = "O nome deve conter entre 1 e 255 caracteres")
        String nomeResponsavel,

        @NotBlank(message = "O RA é obrigatório")
        @Size(min = 1, max = 10, message = "O RA deve conter entre 1 e 10 caracteres")
        String ra,

        @NotBlank(message = "O nome do projeto é obrigatório")
        @Size(min = 1, max = 255, message = "O nome do projeto deve conter entre 1 e 255 caracteres")
        String nomeProjeto,

        @NotBlank(message = "A decrição do projeto é obrigatória")
        String descricao
) {
    public Projeto mapear() {
        Projeto projeto = new Projeto();

        if (this.id != null) {
            projeto.setId(this.id);
        }

        projeto.setNomeResponsavel(this.nomeResponsavel);
        projeto.setRa(this.ra);
        projeto.setNomeProjeto(this.nomeProjeto);
        projeto.setDescricao(this.descricao);

        return projeto;
    }
}
