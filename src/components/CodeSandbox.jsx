import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Play, Copy, Download, RefreshCw, Code, Terminal, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import toast from 'react-hot-toast';

const CodeSandbox = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Obtener lenguajes soportados
  const { data: languagesData } = useApi('/api/sandbox/languages');
  
  // Obtener ejemplos de código
  const { data: examplesData } = useApi('/api/sandbox/examples');

  // Mutación para ejecutar código
  const { mutate: executeCode, loading: executing } = useMutation('/api/sandbox/execute', {
    onSuccess: (data) => {
      setResult(data);
      if (data.success) {
        toast.success('Código ejecutado exitosamente');
      } else {
        toast.error('Error en la ejecución');
      }
    },
    onError: (error) => {
      toast.error(`Error: ${error}`);
      setResult({
        success: false,
        error: error,
        language: language
      });
    }
  });

  // Cargar ejemplo cuando cambia el lenguaje
  useEffect(() => {
    if (examplesData?.examples?.[language] && !code) {
      setCode(examplesData.examples[language]);
    }
  }, [language, examplesData]);

  const handleExecute = () => {
    if (!code.trim()) {
      toast.error('El código no puede estar vacío');
      return;
    }

    setIsExecuting(true);
    executeCode({
      code: code,
      language: language,
      input: input
    }).finally(() => {
      setIsExecuting(false);
    });
  };

  const handleLoadExample = () => {
    if (examplesData?.examples?.[language]) {
      setCode(examplesData.examples[language]);
      setResult(null);
      toast.success('Ejemplo cargado');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado al portapapeles');
  };

  const handleCopyOutput = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      toast.success('Salida copiada al portapapeles');
    }
  };

  const handleClear = () => {
    setCode('');
    setInput('');
    setResult(null);
  };

  const getLanguageIcon = (lang) => {
    const icons = {
      python: '🐍',
      javascript: '⚡',
      bash: '🐚'
    };
    return icons[lang] || '📝';
  };

  const formatExecutionTime = (time) => {
    if (!time) return 'N/A';
    return `${time}s`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Terminal className="h-8 w-8" />
            Code Sandbox
          </h1>
          <p className="text-muted-foreground mt-1">
            Ejecuta código de forma segura en un entorno aislado
          </p>
        </div>
        
        {languagesData?.docker_available && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Docker Disponible
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Código */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Editor de Código
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languagesData?.languages?.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        <span className="flex items-center gap-2">
                          {getLanguageIcon(lang)} {lang}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadExample}
                  disabled={!examplesData?.examples?.[language]}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Ejemplo
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 space-y-4">
            {/* Editor de código */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Código</label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Escribe tu código ${language} aquí...`}
                className="font-mono text-sm min-h-[300px] resize-none"
              />
            </div>
            
            {/* Input para el programa */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Input (opcional)</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Datos de entrada para tu programa..."
                className="font-mono text-sm h-20 resize-none"
              />
            </div>
            
            {/* Botones de acción */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={handleExecute}
                disabled={isExecuting || executing || !code.trim()}
                className="flex-1"
              >
                {(isExecuting || executing) ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {(isExecuting || executing) ? 'Ejecutando...' : 'Ejecutar'}
              </Button>
              
              <Button variant="outline" onClick={handleCopyCode} disabled={!code}>
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Resultados */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Resultados
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1">
            {!result ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Ejecuta código para ver los resultados</p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="output" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="output">Salida</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="output" className="space-y-4">
                  {/* Status del resultado */}
                  <Alert variant={result.success ? "default" : "destructive"}>
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <AlertDescription>
                        {result.success ? 'Ejecución exitosa' : 'Error en la ejecución'}
                      </AlertDescription>
                    </div>
                  </Alert>
                  
                  {/* Output del código */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Output</label>
                      {result.output && (
                        <Button variant="ghost" size="sm" onClick={handleCopyOutput}>
                          <Copy className="h-3 w-3 mr-1" />
                          Copiar
                        </Button>
                      )}
                    </div>
                    
                    <ScrollArea className="h-64 border rounded-md p-3">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {result.output || result.error || 'Sin salida'}
                      </pre>
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium">Lenguaje</label>
                      <p className="text-muted-foreground">{result.language}</p>
                    </div>
                    
                    <div>
                      <label className="font-medium">Código de Salida</label>
                      <p className="text-muted-foreground">{result.exit_code ?? 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="font-medium">Tiempo de Ejecución</label>
                      <p className="text-muted-foreground">
                        {formatExecutionTime(result.execution_time)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="font-medium">Estado</label>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? 'Éxito' : 'Error'}
                      </Badge>
                    </div>
                  </div>
                  
                  {result.error && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Error Detallado</label>
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="font-mono text-xs">
                          {result.error}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {result.security_note && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Nota de Seguridad:</strong> {result.security_note}
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Sandbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Lenguajes Soportados</h4>
              <div className="flex flex-wrap gap-1">
                {languagesData?.languages?.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {getLanguageIcon(lang)} {lang}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Limitaciones</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Timeout: 15-30 segundos</li>
                <li>• Memoria: 64-128MB</li>
                <li>• Sin acceso a red</li>
                <li>• Sin operaciones de archivo</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Seguridad</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Entorno aislado</li>
                <li>• Filtros de código malicioso</li>
                <li>• Límites de recursos</li>
                <li>• Ejecución temporal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeSandbox;
