-- IDs dos 12 fake + status deles
SELECT id, nome_completo, cpf, email, status::text, created_at
FROM colaboradores
WHERE cpf LIKE '123.456.789%'
ORDER BY created_at;

-- Total geral
SELECT count(*) AS total_colaboradores FROM colaboradores;
