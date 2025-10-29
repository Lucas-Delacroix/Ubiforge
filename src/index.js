"use strict";

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

async function executePlan(config) {
  // TODO
  // - Validar dependências do sistema (xorriso, squashfs-tools, etc.)
  // - Fazer download da ISO oficial quando solicitado
  // - Montar ISO, injetar pacotes/arquivos, regenerar initrd (se necessário)
  // - Gerar ISO final em config.outputDir

  console.log("\nUbiforge — plano de execução (pré-implementação)\n");
  console.log("Configuração resolvida:");
  console.log(pretty(config));
  console.log("\nPróximos passos (a implementar):");
  console.log("- Verificar ferramentas do host (xorriso, squashfs-tools, genisoimage, 7z)");
  console.log("- Obter ISO base (download ou local)");
  console.log("- Preparar árvore de trabalho");
  console.log("- Injetar pacotes/alterações e customizações");
  console.log("- Reempacotar ISO final");

  // Placeholder para permitir extensão futura sem quebrar fluxo
  return { ok: true };
}

module.exports = { executePlan };

