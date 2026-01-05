export const feriadoTransformer = {
  toAPI: (data: any) => ({ data: data.data, descricao: data.descricao, tipo: data.tipo, uf: data.uf, municipio_id: data.municipioId, recorrente: data.recorrente, ativo: data.ativo }),
  fromAPI: (data: any) => ({ id: data.id, data: new Date(data.data), descricao: data.descricao, tipo: data.tipo, uf: data.uf, municipioId: data.municipio_id, recorrente: data.recorrente, ativo: data.ativo }),
};
export default feriadoTransformer;
