const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
          <span className="status-dot status-dot-success" />
          <span className="text-sm text-muted-foreground">Design System Pronto</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
          Aguardando Requisitos
        </h1>
        
        <p className="text-muted-foreground">
          Envie os requisitos para começarmos.
        </p>
      </div>
    </div>
  );
};

export default Index;
