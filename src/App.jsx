import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  MessageSquare, 
  Code, 
  Settings, 
  Activity, 
  Rocket, 
  Brain, 
  Shield, 
  Zap,
  BarChart3,
  Terminal,
  FileCode,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react'
import './App.css'

// Componente Dashboard Principal
function Dashboard() {
  const [systemMetrics, setSystemMetrics] = useState(null)
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemMetrics()
    fetchAnomalies()
  }, [])

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch('/api/repair/metrics')
      const data = await response.json()
      setSystemMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const fetchAnomalies = async () => {
    try {
      const response = await fetch('/api/repair/anomalies')
      const data = await response.json()
      setAnomalies(data.anomalies || [])
    } catch (error) {
      console.error('Error fetching anomalies:', error)
    } finally {
      setLoading(false)
    }
  }

  const startMonitoring = async () => {
    try {
      await fetch('/api/repair/start-monitoring', { method: 'POST' })
      fetchSystemMetrics()
    } catch (error) {
      console.error('Error starting monitoring:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de IA Unificado</h1>
          <p className="text-gray-600 mt-2">Panel de control inteligente con capacidades de autorreparación</p>
        </div>
        <Button onClick={startMonitoring} className="bg-blue-600 hover:bg-blue-700">
          <Activity className="w-4 h-4 mr-2" />
          Iniciar Monitoreo
        </Button>
      </div>

      {/* Métricas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.cpu_usage?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">Uso actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memoria</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.memory_usage?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">Uso actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disco</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.disk_usage?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">Uso actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respuesta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.avg_response_time?.toFixed(2) || '0'}s
            </div>
            <p className="text-xs text-muted-foreground">Tiempo promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Monitoreo Activo</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Activo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Anomalías Detectadas</span>
                <Badge variant={anomalies.length > 0 ? "destructive" : "outline"}>
                  {anomalies.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Peticiones Totales</span>
                <span className="font-medium">{systemMetrics?.total_requests || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Anomalías Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {anomalies.length > 0 ? (
              <div className="space-y-2">
                {anomalies.slice(0, 3).map((anomaly, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{anomaly.type}</p>
                      <p className="text-xs text-gray-600">{anomaly.description}</p>
                    </div>
                    <Badge variant="outline" className={
                      anomaly.severity === 'high' ? 'border-red-200 text-red-700' : 
                      anomaly.severity === 'medium' ? 'border-orange-200 text-orange-700' : 
                      'border-yellow-200 text-yellow-700'
                    }>
                      {anomaly.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No se detectaron anomalías</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Herramientas y funciones principales del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/chat">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <MessageSquare className="w-6 h-6 mb-2" />
                Chat IA
              </Button>
            </Link>
            <Link to="/code-generator">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Code className="w-6 h-6 mb-2" />
                Generar Código
              </Button>
            </Link>
            <Link to="/system-monitor">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Activity className="w-6 h-6 mb-2" />
                Monitor Sistema
              </Button>
            </Link>
            <Link to="/deployment">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Rocket className="w-6 h-6 mb-2" />
                Despliegue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente Chat IA
function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: 'user', content: inputMessage, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId
        })
      })

      const data = await response.json()
      
      if (data.response) {
        const aiMessage = { 
          role: 'assistant', 
          content: data.response, 
          timestamp: data.timestamp 
        }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al procesar tu mensaje.', 
        timestamp: new Date().toISOString() 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Asistente de IA</h1>
        <p className="text-gray-600 mt-2">Conversa con el asistente inteligente especializado en programación</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Chat Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>¡Hola! Soy tu asistente de IA. Puedo ayudarte con programación, desarrollo y mucho más.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-500">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente Generador de Código
function CodeGenerator() {
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('python')
  const [framework, setFramework] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)

  const generateCode = async () => {
    if (!description.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          language,
          framework: framework || undefined
        })
      })

      const data = await response.json()
      if (data.code) {
        setGeneratedCode(data.code)
      }
    } catch (error) {
      console.error('Error generating code:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Generador de Código</h1>
        <p className="text-gray-600 mt-2">Genera código automáticamente usando inteligencia artificial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCode className="w-5 h-5 mr-2 text-green-600" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Descripción del código</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe qué código necesitas generar..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lenguaje</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Framework (opcional)</label>
                <input
                  type="text"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  placeholder="Flask, React, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <Button 
              onClick={generateCode} 
              disabled={loading || !description.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generar Código
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-blue-600" />
              Código Generado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto h-96">
                <pre>{generatedCode}</pre>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Terminal className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>El código generado aparecerá aquí</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente Monitor del Sistema
function SystemMonitor() {
  const [metrics, setMetrics] = useState(null)
  const [repairHistory, setRepairHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    fetchRepairHistory()
    const interval = setInterval(fetchMetrics, 5000) // Actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/repair/metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRepairHistory = async () => {
    try {
      const response = await fetch('/api/repair/repair-history')
      const data = await response.json()
      setRepairHistory(data.history || [])
    } catch (error) {
      console.error('Error fetching repair history:', error)
    }
  }

  const runAutoRepair = async () => {
    try {
      const response = await fetch('/api/repair/auto-repair', { method: 'POST' })
      const data = await response.json()
      console.log('Auto-repair result:', data)
      fetchRepairHistory()
    } catch (error) {
      console.error('Error running auto-repair:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitor del Sistema</h1>
          <p className="text-gray-600 mt-2">Monitoreo en tiempo real y autorreparación</p>
        </div>
        <Button onClick={runAutoRepair} className="bg-red-600 hover:bg-red-700">
          <Shield className="w-4 h-4 mr-2" />
          Auto-Reparar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Métricas en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Cpu className="w-5 h-5 mr-2 text-blue-600" />
                    <span>CPU</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{metrics.cpu_usage?.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Uso actual</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <MemoryStick className="w-5 h-5 mr-2 text-green-600" />
                    <span>Memoria</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{metrics.memory_usage?.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Uso actual</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <HardDrive className="w-5 h-5 mr-2 text-orange-600" />
                    <span>Disco</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{metrics.disk_usage?.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Uso actual</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-600" />
                    <span>Respuesta</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{metrics.avg_response_time?.toFixed(2)}s</div>
                    <div className="text-xs text-gray-500">Tiempo promedio</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Cargando métricas...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-600" />
              Historial de Reparaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {repairHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {repairHistory.slice(0, 10).map((repair, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{repair.action}</span>
                      <Badge variant={repair.success ? "outline" : "destructive"}>
                        {repair.success ? 'Éxito' : 'Error'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{repair.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(repair.start_time).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay reparaciones registradas</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente Despliegue
function DeploymentManager() {
  const [deploymentHistory, setDeploymentHistory] = useState([])
  const [strategies, setStrategies] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeploymentHistory()
    fetchStrategies()
  }, [])

  const fetchDeploymentHistory = async () => {
    try {
      const response = await fetch('/api/deploy/deployment-history')
      const data = await response.json()
      setDeploymentHistory(data.history || [])
    } catch (error) {
      console.error('Error fetching deployment history:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStrategies = async () => {
    try {
      const response = await fetch('/api/deploy/strategies')
      const data = await response.json()
      setStrategies(data)
    } catch (error) {
      console.error('Error fetching strategies:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestor de Despliegues</h1>
        <p className="text-gray-600 mt-2">Despliegue inteligente y automatizado de aplicaciones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="w-5 h-5 mr-2 text-blue-600" />
              Estrategias Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strategies?.strategies ? (
              <div className="space-y-3">
                {Object.entries(strategies.strategies).map(([key, strategy]) => (
                  <div key={key} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                      <Badge variant="outline">{strategy.complexity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{strategy.description}</p>
                    <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                      <span>Downtime: {strategy.downtime}</span>
                      <span>Rollback: {strategy.rollback_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Cargando estrategias...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-green-600" />
              Historial de Despliegues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deploymentHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {deploymentHistory.map((deployment, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{deployment.deployment_id}</span>
                      <Badge variant={deployment.status === 'completed' ? "outline" : "destructive"}>
                        {deployment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Estrategia: {deployment.strategy}</p>
                      <p>Proveedor: {deployment.provider}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(deployment.start_time).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay despliegues registrados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente de Navegación
function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/chat', label: 'Chat IA', icon: MessageSquare },
    { path: '/code-generator', label: 'Código', icon: Code },
    { path: '/system-monitor', label: 'Monitor', icon: Activity },
    { path: '/deployment', label: 'Despliegue', icon: Rocket },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">IA Unificado</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Componente Principal de la App
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/code-generator" element={<CodeGenerator />} />
            <Route path="/system-monitor" element={<SystemMonitor />} />
            <Route path="/deployment" element={<DeploymentManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

