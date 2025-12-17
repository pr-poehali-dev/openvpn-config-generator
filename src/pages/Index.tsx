import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRCode from 'qrcode';

type Protocol = 'openvpn' | 'wireguard' | 'ikev2' | 'ipsec';

interface ProtocolInfo {
  name: string;
  description: string;
  features: string[];
  speed: string;
  security: string;
}

const protocols: Record<Protocol, ProtocolInfo> = {
  openvpn: {
    name: 'OpenVPN',
    description: 'Универсальный и надёжный протокол с открытым исходным кодом',
    features: ['Работает на всех платформах', 'Обход блокировок', 'Гибкая настройка'],
    speed: 'Средняя',
    security: 'Очень высокая',
  },
  wireguard: {
    name: 'WireGuard',
    description: 'Современный протокол с максимальной скоростью и безопасностью',
    features: ['Самый быстрый', 'Минимум кода', 'Низкое энергопотребление'],
    speed: 'Максимальная',
    security: 'Очень высокая',
  },
  ikev2: {
    name: 'IKEv2/IPSec',
    description: 'Отличный выбор для мобильных устройств',
    features: ['Быстрое переподключение', 'Стабильность на мобильных', 'Нативная поддержка'],
    speed: 'Высокая',
    security: 'Высокая',
  },
  ipsec: {
    name: 'IPSec',
    description: 'Проверенный временем протокол для корпоративных сетей',
    features: ['Нативная поддержка в ОС', 'Корпоративный стандарт', 'Надёжность'],
    speed: 'Средняя',
    security: 'Высокая',
  },
};

interface ServerLocation {
  country: string;
  city: string;
  address: string;
  flag: string;
  port: string;
}

const serverLocations: ServerLocation[] = [
  { country: 'США', city: 'Нью-Йорк', address: 'us-ny.vpn.example.com', flag: '🇺🇸', port: '1194' },
  { country: 'США', city: 'Лос-Анджелес', address: 'us-la.vpn.example.com', flag: '🇺🇸', port: '1194' },
  { country: 'Германия', city: 'Франкфурт', address: 'de-fra.vpn.example.com', flag: '🇩🇪', port: '1194' },
  { country: 'Германия', city: 'Берлин', address: 'de-ber.vpn.example.com', flag: '🇩🇪', port: '1194' },
  { country: 'Сингапур', city: 'Сингапур', address: 'sg.vpn.example.com', flag: '🇸🇬', port: '1194' },
  { country: 'Япония', city: 'Токио', address: 'jp-tok.vpn.example.com', flag: '🇯🇵', port: '1194' },
  { country: 'Великобритания', city: 'Лондон', address: 'uk-lon.vpn.example.com', flag: '🇬🇧', port: '1194' },
  { country: 'Франция', city: 'Париж', address: 'fr-par.vpn.example.com', flag: '🇫🇷', port: '1194' },
  { country: 'Нидерланды', city: 'Амстердам', address: 'nl-ams.vpn.example.com', flag: '🇳🇱', port: '1194' },
  { country: 'Канада', city: 'Торонто', address: 'ca-tor.vpn.example.com', flag: '🇨🇦', port: '1194' },
  { country: 'Австралия', city: 'Сидней', address: 'au-syd.vpn.example.com', flag: '🇦🇺', port: '1194' },
  { country: 'Швейцария', city: 'Цюрих', address: 'ch-zur.vpn.example.com', flag: '🇨🇭', port: '1194' },
];

const faqItems = [
  {
    question: 'Что такое VPN конфиг и зачем он нужен?',
    answer: 'VPN конфиг — это файл настроек, который позволяет вашему устройству подключиться к VPN серверу. С его помощью вы можете обеспечить безопасность данных, обойти блокировки и сохранить анонимность в интернете.',
  },
  {
    question: 'Какой протокол выбрать?',
    answer: 'WireGuard — для максимальной скорости и современных устройств. OpenVPN — для универсальности и обхода блокировок. IKEv2 — для мобильных устройств. IPSec — для корпоративного использования.',
  },
  {
    question: 'Как использовать сгенерированный конфиг?',
    answer: 'Скачайте сгенерированный файл конфигурации и импортируйте его в ваше VPN приложение (например, OpenVPN Connect, WireGuard app или встроенные настройки ОС). После импорта просто активируйте подключение.',
  },
  {
    question: 'Конфиги действительно безлимитные?',
    answer: 'Да! Все генерируемые конфиги не имеют ограничений по времени использования, трафику или количеству подключений. Используйте их сколько угодно на любых устройствах.',
  },
  {
    question: 'На каких устройствах работают конфиги?',
    answer: 'Конфиги работают на всех популярных платформах: Windows, macOS, Linux, iOS, Android, роутерах и других устройствах с поддержкой выбранного протокола.',
  },
  {
    question: 'Безопасно ли использовать эти конфиги?',
    answer: 'Да, все протоколы используют современные методы шифрования. OpenVPN и WireGuard используют AES-256, IKEv2/IPSec — также AES с Perfect Forward Secrecy. Ваши данные надёжно защищены.',
  },
];

export default function Index() {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>('wireguard');
  const [activeSection, setActiveSection] = useState<'home' | 'generator' | 'faq'>('home');
  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('custom');
  const [serverAddress, setServerAddress] = useState<string>('vpn.example.com');
  const [serverPort, setServerPort] = useState<string>('1194');
  const [dnsServers, setDnsServers] = useState<string>('1.1.1.1, 8.8.8.8');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    if (value !== 'custom') {
      const location = serverLocations.find(loc => `${loc.address}` === value);
      if (location) {
        setServerAddress(location.address);
        setServerPort(location.port);
      }
    }
  };

  const generateConfig = () => {
    const timestamp = new Date().toISOString();
    const randomKey = Math.random().toString(36).substring(2, 15);
    
    let config = '';
    
    switch (selectedProtocol) {
      case 'openvpn':
        config = `# OpenVPN Configuration
# Generated: ${timestamp}
client
dev tun
proto udp
remote ${serverAddress} ${serverPort}
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
key-direction 1
verb 3
<ca>
# Certificate Authority
</ca>
<cert>
# Client Certificate
</cert>
<key>
# Private Key: ${randomKey}
</key>
<tls-auth>
# TLS Auth Key
</tls-auth>`;
        break;
      case 'wireguard':
        config = `[Interface]
# Generated: ${timestamp}
PrivateKey = ${randomKey}base64key==
Address = 10.0.0.2/32
DNS = ${dnsServers}

[Peer]
PublicKey = ServerPublicKeyBase64==
PresharedKey = PresharedKeyBase64==
Endpoint = ${serverAddress}:${serverPort}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`;
        break;
      case 'ikev2':
        config = `# IKEv2/IPSec Configuration
# Generated: ${timestamp}
conn vpn-ikev2
  keyexchange=ikev2
  ike=aes256-sha256-modp2048!
  esp=aes256-sha256!
  dpdaction=clear
  dpddelay=300s
  rekey=no
  left=%any
  leftid=@client-${randomKey}
  leftauth=eap-mschapv2
  right=${serverAddress}
  rightid=@${serverAddress}
  rightauth=pubkey
  rightsendcert=always
  eap_identity=%identity
  auto=add`;
        break;
      case 'ipsec':
        config = `# IPSec Configuration
# Generated: ${timestamp}
config setup
  charondebug="ike 2, knl 2, cfg 2"
  uniqueids=no

conn vpn-ipsec
  type=tunnel
  auto=start
  keyexchange=ikev1
  authby=secret
  left=%any
  leftid=@client-${randomKey}
  right=${serverAddress}
  rightid=@${serverAddress}
  ike=aes256-sha1-modp2048!
  esp=aes256-sha1!
  aggressive=yes
  keyingtries=%forever
  ikelifetime=24h
  lifetime=24h
  dpddelay=30s
  dpdtimeout=120s
  dpdaction=restart`;
        break;
    }
    
    setGeneratedConfig(config);
    generateQRCode(config);
  };

  const generateQRCode = async (config: string) => {
    try {
      const url = await QRCode.toDataURL(config, {
        width: 300,
        margin: 2,
        color: {
          dark: '#10b981',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('QR Code generation failed:', error);
    }
  };

  const downloadConfig = () => {
    const extensions: Record<Protocol, string> = {
      openvpn: 'ovpn',
      wireguard: 'conf',
      ikev2: 'conf',
      ipsec: 'conf',
    };
    
    const blob = new Blob([generatedConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vpn-config-${selectedProtocol}.${extensions[selectedProtocol]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(generatedConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="text-primary-foreground" size={24} />
              </div>
              <span className="text-xl font-bold">VPN Config Generator</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('home')}
              >
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </Button>
              <Button
                variant={activeSection === 'generator' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('generator')}
              >
                <Icon name="Sparkles" size={18} className="mr-2" />
                Генератор
              </Button>
              <Button
                variant={activeSection === 'faq' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('faq')}
              >
                <Icon name="HelpCircle" size={18} className="mr-2" />
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeSection === 'home' && (
          <div className="animate-fade-in space-y-16">
            <section className="text-center space-y-6 py-12">
              <Badge className="mb-4" variant="secondary">
                <Icon name="Zap" size={14} className="mr-1" />
                Безлимитные конфиги
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Генератор VPN конфигов
                <br />
                <span className="text-primary">для всех протоколов</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Создавайте безлимитные VPN конфиги за секунды. Поддержка OpenVPN, WireGuard, IKEv2 и IPSec.
                Работает на всех устройствах. Навсегда.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => setActiveSection('generator')} className="text-lg">
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Создать конфиг
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveSection('faq')} className="text-lg">
                  <Icon name="BookOpen" size={20} className="mr-2" />
                  Узнать больше
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="animate-scale-in">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Icon name="Infinity" className="text-primary" size={24} />
                  </div>
                  <CardTitle>Безлимитно</CardTitle>
                  <CardDescription>
                    Без ограничений по трафику, времени или количеству устройств
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Icon name="Zap" className="text-primary" size={24} />
                  </div>
                  <CardTitle>Быстро</CardTitle>
                  <CardDescription>
                    Генерация конфига за пару кликов. Скачайте и используйте сразу
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Icon name="ShieldCheck" className="text-primary" size={24} />
                  </div>
                  <CardTitle>Безопасно</CardTitle>
                  <CardDescription>
                    Все протоколы используют современное шифрование AES-256
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-center mb-8">Поддерживаемые протоколы</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(protocols).map(([key, protocol]) => (
                  <Card key={key} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">{protocol.name}</CardTitle>
                          <CardDescription className="mt-2">{protocol.description}</CardDescription>
                        </div>
                        <Icon name="Check" className="text-primary" size={24} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Скорость:</span>
                          <span className="font-medium">{protocol.speed}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Безопасность:</span>
                          <span className="font-medium">{protocol.security}</span>
                        </div>
                        <Separator />
                        <ul className="space-y-2">
                          {protocol.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Icon name="CheckCircle2" className="text-primary" size={16} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'generator' && (
          <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Генератор конфигов</h1>
              <p className="text-muted-foreground">
                Выберите протокол и создайте свой безлимитный VPN конфиг
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Выбор протокола</CardTitle>
                <CardDescription>
                  Каждый протокол имеет свои преимущества. Выберите подходящий для ваших задач.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedProtocol} onValueChange={(value) => setSelectedProtocol(value as Protocol)}>
                  <div className="space-y-4">
                    {Object.entries(protocols).map(([key, protocol]) => (
                      <div key={key} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value={key} id={key} className="mt-1" />
                        <Label htmlFor={key} className="flex-1 cursor-pointer">
                          <div className="space-y-1">
                            <div className="font-semibold text-lg">{protocol.name}</div>
                            <div className="text-sm text-muted-foreground">{protocol.description}</div>
                            <div className="flex gap-2 pt-2">
                              <Badge variant="secondary" className="text-xs">
                                {protocol.speed}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {protocol.security}
                              </Badge>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Выбор сервера</CardTitle>
                <CardDescription>
                  Выберите готовый сервер из списка или укажите свой
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="server-location">
                    <Icon name="MapPin" size={16} className="inline mr-1" />
                    Локация сервера
                  </Label>
                  <Select value={selectedLocation} onValueChange={handleLocationChange}>
                    <SelectTrigger id="server-location">
                      <SelectValue placeholder="Выберите сервер" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <Icon name="Settings" size={16} />
                          <span>Свой сервер</span>
                        </div>
                      </SelectItem>
                      {serverLocations.map((location) => (
                        <SelectItem key={location.address} value={location.address}>
                          <div className="flex items-center gap-2">
                            <span>{location.flag}</span>
                            <span>{location.country} — {location.city}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="server-address">
                      <Icon name="Server" size={16} className="inline mr-1" />
                      Адрес сервера
                    </Label>
                    <Input
                      id="server-address"
                      value={serverAddress}
                      onChange={(e) => {
                        setServerAddress(e.target.value);
                        setSelectedLocation('custom');
                      }}
                      placeholder="vpn.example.com"
                      disabled={selectedLocation !== 'custom'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="server-port">
                      <Icon name="Hash" size={16} className="inline mr-1" />
                      Порт
                    </Label>
                    <Input
                      id="server-port"
                      value={serverPort}
                      onChange={(e) => setServerPort(e.target.value)}
                      placeholder="1194"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dns-servers">
                    <Icon name="Globe" size={16} className="inline mr-1" />
                    DNS серверы (через запятую)
                  </Label>
                  <Input
                    id="dns-servers"
                    value={dnsServers}
                    onChange={(e) => setDnsServers(e.target.value)}
                    placeholder="1.1.1.1, 8.8.8.8"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button size="lg" onClick={generateConfig} className="text-lg px-8">
                <Icon name="Sparkles" size={20} className="mr-2" />
                Сгенерировать конфиг
              </Button>
            </div>

            {generatedConfig && (
              <div className="space-y-6">
                <Card className="animate-scale-in">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Ваш конфиг готов!</CardTitle>
                      <Badge variant="default">
                        <Icon name="Check" size={14} className="mr-1" />
                        {protocols[selectedProtocol].name}
                      </Badge>
                    </div>
                    <CardDescription>
                      Скопируйте конфиг или скачайте файл для импорта в ваше VPN приложение
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
                      <pre className="text-sm font-mono">{generatedConfig}</pre>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={downloadConfig} className="flex-1">
                        <Icon name="Download" size={18} className="mr-2" />
                        Скачать файл
                      </Button>
                      <Button onClick={copyConfig} variant="outline" className="flex-1">
                        <Icon name="Copy" size={18} className="mr-2" />
                        Копировать
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {qrCodeUrl && (
                  <Card className="animate-scale-in">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Icon name="QrCode" className="text-primary" size={24} />
                        <CardTitle>QR-код для быстрого подключения</CardTitle>
                      </div>
                      <CardDescription>
                        Отсканируйте QR-код в вашем VPN приложении на мобильном устройстве
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-primary/20">
                        <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        <p>Откройте приложение {protocols[selectedProtocol].name}</p>
                        <p>и отсканируйте этот код для мгновенного подключения</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Часто задаваемые вопросы</h1>
              <p className="text-muted-foreground">
                Всё, что нужно знать о генерации и использовании VPN конфигов
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <span className="font-semibold">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Lightbulb" className="text-primary" size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Не нашли ответ?</h3>
                    <p className="text-muted-foreground">
                      Попробуйте сгенерировать конфиг и протестировать его на вашем устройстве. 
                      В большинстве случаев процесс очень простой и интуитивный.
                    </p>
                    <Button onClick={() => setActiveSection('generator')} className="mt-2">
                      Перейти к генератору
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>VPN Config Generator — Безлимитные конфиги для всех протоколов</p>
          <p className="mt-2">OpenVPN • WireGuard • IKEv2 • IPSec</p>
        </div>
      </footer>
    </div>
  );
}