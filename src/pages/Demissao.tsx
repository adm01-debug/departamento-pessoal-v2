/**
 * @fileoverview Redirecionamento para Desligamento
 * @deprecated Use /desligamento diretamente
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Demissao() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/desligamento', { replace: true });
  }, [navigate]);
  
  return null;
}
