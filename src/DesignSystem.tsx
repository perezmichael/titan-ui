import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toggle } from './ui/toggle';
import { Skeleton } from './ui/skeleton';
import {
  AlertCircle, Info, CheckCircle2, Bell, Bold, Italic, Underline,
  ChevronRight, Home, Layers, Type, Square, ToggleLeft, AlignLeft,
  List, Image, Sliders, Circle, CreditCard, AlertTriangle, Minus
} from 'lucide-react';

const sections = [
  { id: 'colors', label: 'Colors', icon: <Circle className="w-3.5 h-3.5" /> },
  { id: 'typography', label: 'Typography', icon: <Type className="w-3.5 h-3.5" /> },
  { id: 'buttons', label: 'Button', icon: <Square className="w-3.5 h-3.5" /> },
  { id: 'inputs', label: 'Input', icon: <AlignLeft className="w-3.5 h-3.5" /> },
  { id: 'textarea', label: 'Textarea', icon: <AlignLeft className="w-3.5 h-3.5" /> },
  { id: 'select', label: 'Select', icon: <List className="w-3.5 h-3.5" /> },
  { id: 'checkbox', label: 'Checkbox', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: 'switch', label: 'Switch', icon: <ToggleLeft className="w-3.5 h-3.5" /> },
  { id: 'toggle', label: 'Toggle', icon: <ToggleLeft className="w-3.5 h-3.5" /> },
  { id: 'badge', label: 'Badge', icon: <Circle className="w-3.5 h-3.5" /> },
  { id: 'card', label: 'Card', icon: <CreditCard className="w-3.5 h-3.5" /> },
  { id: 'alert', label: 'Alert', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { id: 'tabs', label: 'Tabs', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'progress', label: 'Progress', icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: 'slider', label: 'Slider', icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: 'avatar', label: 'Avatar', icon: <Image className="w-3.5 h-3.5" /> },
  { id: 'skeleton', label: 'Skeleton', icon: <Minus className="w-3.5 h-3.5" /> },
  { id: 'separator', label: 'Separator', icon: <Minus className="w-3.5 h-3.5" /> },
];

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <Separator className="mb-6" />
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function ColorSwatch({ name, hex, className }: { name: string; hex: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-16 h-16 rounded-lg border border-black/10 ${className}`} />
      <div className="text-center">
        <p className="text-xs font-medium text-gray-700">{name}</p>
        <p className="text-[10px] text-gray-400">{hex}</p>
      </div>
    </div>
  );
}

export function DesignSystem() {
  const [activeSection, setActiveSection] = useState('colors');
  const [switchOn, setSwitchOn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [progress] = useState(60);
  const [sliderVal, setSliderVal] = useState([40]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-screen bg-[#f5f5f3] font-sans">
      {/* Left Nav */}
      <div className="w-52 bg-[#efeeeb] border-r border-gray-200 flex flex-col h-screen overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Titan AI</div>
          <div className="text-sm font-semibold text-gray-900">Design System</div>
        </div>
        <div className="py-2 px-2 flex-1">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 py-2">Components</div>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors text-left ${
                activeSection === s.id
                  ? 'bg-[#455a4f] text-white'
                  : 'text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              <span className={activeSection === s.id ? 'text-white' : 'text-gray-400'}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-gray-200">
          <a
            href="/"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to app
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-10 py-10">

          {/* Colors */}
          <div id="colors">
            <Section title="Colors" description="Core brand palette and semantic color tokens.">
              <Row label="Brand">
                <ColorSwatch name="Brand Green" hex="#455a4f" className="bg-[#455a4f]" />
                <ColorSwatch name="Brand Hover" hex="#3a4a42" className="bg-[#3a4a42]" />
                <ColorSwatch name="Sidebar BG" hex="#efeeeb" className="bg-[#efeeeb]" />
                <ColorSwatch name="App BG" hex="#f5f5f3" className="bg-[#f5f5f3]" />
              </Row>
              <Row label="Semantic">
                <ColorSwatch name="Success" hex="#16a34a" className="bg-green-600" />
                <ColorSwatch name="Warning" hex="#d97706" className="bg-amber-600" />
                <ColorSwatch name="Destructive" hex="#dc2626" className="bg-red-600" />
                <ColorSwatch name="Info" hex="#2563eb" className="bg-blue-600" />
              </Row>
              <Row label="Grays">
                <ColorSwatch name="Gray 100" hex="#f3f4f6" className="bg-gray-100" />
                <ColorSwatch name="Gray 200" hex="#e5e7eb" className="bg-gray-200" />
                <ColorSwatch name="Gray 400" hex="#9ca3af" className="bg-gray-400" />
                <ColorSwatch name="Gray 600" hex="#4b5563" className="bg-gray-600" />
                <ColorSwatch name="Gray 900" hex="#111827" className="bg-gray-900" />
              </Row>
            </Section>
          </div>

          {/* Typography */}
          <div id="typography">
            <Section title="Typography" description="Type scale used throughout the interface.">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">text-2xl</p>
                  <p className="text-2xl text-gray-900">Heading / Page Title</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">text-lg font-semibold</p>
                  <p className="text-lg font-semibold text-gray-900">Section Heading</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">text-base font-medium</p>
                  <p className="text-base font-medium text-gray-900">Subheading / Card Title</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">text-sm</p>
                  <p className="text-sm text-gray-700">Body text — primary content, descriptions, paragraphs.</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">text-xs</p>
                  <p className="text-xs text-gray-600">Small text — labels, metadata, table headers.</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">text-[10px] uppercase tracking-wide</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Eyebrow / section label</p>
                </div>
              </div>
            </Section>
          </div>

          {/* Button */}
          <div id="buttons">
            <Section title="Button" description="shadcn/ui Button with all variants and sizes.">
              <Row label="Variants">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </Row>
              <Row label="Sizes">
                <Button size="lg">Large</Button>
                <Button size="default">Default</Button>
                <Button size="sm">Small</Button>
                <Button size="icon"><Bell className="w-4 h-4" /></Button>
              </Row>
              <Row label="Disabled">
                <Button disabled>Default</Button>
                <Button variant="outline" disabled>Outline</Button>
                <Button variant="destructive" disabled>Destructive</Button>
              </Row>
              <Row label="With icon">
                <Button><CheckCircle2 className="w-4 h-4" /> Save changes</Button>
                <Button variant="outline"><ChevronRight className="w-4 h-4" /> Continue</Button>
                <Button variant="destructive"><AlertCircle className="w-4 h-4" /> Delete</Button>
              </Row>
              <Row label="Brand (custom)">
                <button className="w-8 h-8 bg-[#455a4f] hover:bg-[#3a4a42] text-white rounded flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400">Send button used in ChatArea</span>
              </Row>
            </Section>
          </div>

          {/* Input */}
          <div id="inputs">
            <Section title="Input" description="Text input field.">
              <Row label="States">
                <div className="flex flex-col gap-2 w-64">
                  <Label>Default</Label>
                  <Input placeholder="Placeholder text" />
                </div>
                <div className="flex flex-col gap-2 w-64">
                  <Label>With value</Label>
                  <Input defaultValue="Tom Barr" />
                </div>
                <div className="flex flex-col gap-2 w-64">
                  <Label>Disabled</Label>
                  <Input placeholder="Disabled" disabled />
                </div>
              </Row>
              <Row label="With label">
                <div className="flex flex-col gap-1.5 w-64">
                  <Label htmlFor="email-ex">Email address</Label>
                  <Input id="email-ex" type="email" placeholder="tom@titanbanking.ai" />
                </div>
              </Row>
              <Row label="With icon (custom pattern)">
                <div className="relative w-64">
                  <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input className="pl-9" placeholder="Search..." />
                </div>
              </Row>
            </Section>
          </div>

          {/* Textarea */}
          <div id="textarea">
            <Section title="Textarea" description="Multi-line text input.">
              <Row label="Default">
                <div className="flex flex-col gap-1.5 w-80">
                  <Label>Notes</Label>
                  <Textarea placeholder="Add your notes here..." rows={3} />
                </div>
                <div className="flex flex-col gap-1.5 w-80">
                  <Label>Disabled</Label>
                  <Textarea placeholder="Disabled" disabled rows={3} />
                </div>
              </Row>
            </Section>
          </div>

          {/* Select */}
          <div id="select">
            <Section title="Select" description="Dropdown select menu.">
              <Row label="Default">
                <div className="flex flex-col gap-1.5 w-52">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Row>
            </Section>
          </div>

          {/* Checkbox */}
          <div id="checkbox">
            <Section title="Checkbox" description="Binary selection control.">
              <Row label="States">
                <div className="flex items-center gap-2">
                  <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
                  <Label htmlFor="cb1">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb2" defaultChecked />
                  <Label htmlFor="cb2">Checked (default)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb3" disabled />
                  <Label htmlFor="cb3" className="text-gray-400">Disabled</Label>
                </div>
              </Row>
            </Section>
          </div>

          {/* Switch */}
          <div id="switch">
            <Section title="Switch" description="Toggle binary setting on/off.">
              <Row label="States">
                <div className="flex items-center gap-2">
                  <Switch id="sw1" checked={switchOn} onCheckedChange={setSwitchOn} />
                  <Label htmlFor="sw1">{switchOn ? 'Enabled' : 'Disabled'}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sw2" defaultChecked />
                  <Label htmlFor="sw2">Default on</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="sw3" disabled />
                  <Label htmlFor="sw3" className="text-gray-400">Disabled</Label>
                </div>
              </Row>
            </Section>
          </div>

          {/* Toggle */}
          <div id="toggle">
            <Section title="Toggle" description="Pressed/unpressed toggle button, commonly used in toolbars.">
              <Row label="Single">
                <Toggle aria-label="Bold"><Bold className="w-4 h-4" /></Toggle>
                <Toggle aria-label="Italic"><Italic className="w-4 h-4" /></Toggle>
                <Toggle aria-label="Underline"><Underline className="w-4 h-4" /></Toggle>
              </Row>
              <Row label="Variants">
                <Toggle variant="default" aria-label="Bold"><Bold className="w-4 h-4" /></Toggle>
                <Toggle variant="outline" aria-label="Bold"><Bold className="w-4 h-4" /></Toggle>
              </Row>
            </Section>
          </div>

          {/* Badge */}
          <div id="badge">
            <Section title="Badge" description="Small status and label chips.">
              <Row label="Variants">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </Row>
              <Row label="Semantic (custom)">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-3 h-3" /> Failed
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  <Info className="w-3 h-3" /> Syncing
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-green-300 text-green-700 text-[10px] font-medium uppercase tracking-wide">
                  <CheckCircle2 className="w-3 h-3" /> High confidence
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-amber-300 text-amber-700 text-[10px] font-medium uppercase tracking-wide">
                  <Info className="w-3 h-3" /> Medium confidence
                </span>
              </Row>
            </Section>
          </div>

          {/* Card */}
          <div id="card">
            <Section title="Card" description="Content container with header, content, and footer slots.">
              <Row label="Default">
                <Card className="w-80">
                  <CardHeader>
                    <CardTitle>VFN Holdings Inc</CardTitle>
                    <CardDescription>Commercial lending relationship — Active</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Outstanding balance: $4.2M across 3 active notes. Last review completed Jan 2026.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">View details</Button>
                    <Button size="sm">Start review</Button>
                  </CardFooter>
                </Card>
              </Row>
              <Row label="Simple (used in AgentsView)">
                <div className="bg-white border border-gray-200 rounded-lg p-4 w-64 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-base font-medium text-gray-900 mb-1">Commercial Lending</div>
                  <p className="text-xs text-gray-500 mb-3">End-to-end loan lifecycle management with AI-assisted workflows.</p>
                  <span className="text-xs text-[#455a4f] font-medium">Launch agent →</span>
                </div>
              </Row>
            </Section>
          </div>

          {/* Alert */}
          <div id="alert">
            <Section title="Alert" description="Contextual feedback messages.">
              <div className="space-y-3 max-w-lg">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>Your session is active. Data last synced 2 minutes ago.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Authentication failed: OAuth token expired. Please reconnect.</AlertDescription>
                </Alert>
              </div>
            </Section>
          </div>

          {/* Tabs */}
          <div id="tabs">
            <Section title="Tabs" description="Horizontal tab navigation for switching views.">
              <Row label="Default">
                <Tabs defaultValue="overview" className="w-full max-w-lg">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-3">
                    <p className="text-sm text-gray-600">Overview tab content — summary data, KPIs, status.</p>
                  </TabsContent>
                  <TabsContent value="documents" className="mt-3">
                    <p className="text-sm text-gray-600">Documents tab content — file list, uploads.</p>
                  </TabsContent>
                  <TabsContent value="activity" className="mt-3">
                    <p className="text-sm text-gray-600">Activity tab content — audit log, history.</p>
                  </TabsContent>
                </Tabs>
              </Row>
            </Section>
          </div>

          {/* Progress */}
          <div id="progress">
            <Section title="Progress" description="Linear progress indicator.">
              <div className="space-y-4 max-w-sm">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Upload progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Complete</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Just started</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} />
                </div>
              </div>
            </Section>
          </div>

          {/* Slider */}
          <div id="slider">
            <Section title="Slider" description="Range input control.">
              <div className="space-y-4 max-w-sm">
                <div>
                  <Label className="mb-2 block">Confidence threshold: {sliderVal[0]}%</Label>
                  <Slider
                    value={sliderVal}
                    onValueChange={setSliderVal}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Disabled</Label>
                  <Slider defaultValue={[50]} disabled />
                </div>
              </div>
            </Section>
          </div>

          {/* Avatar */}
          <div id="avatar">
            <Section title="Avatar" description="User identity representation.">
              <Row label="Fallback initials">
                <Avatar className="w-10 h-10 bg-[#455a4f]">
                  <AvatarFallback className="bg-[#455a4f] text-white text-sm">TB</AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">JD</AvatarFallback>
                </Avatar>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#455a4f] text-white text-xs">TB</AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-[#455a4f] text-white text-[10px]">TB</AvatarFallback>
                </Avatar>
              </Row>
              <Row label="Used in sidebar">
                <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                  <div className="w-6 h-6 bg-[#455a4f] rounded-full flex items-center justify-center text-white text-xs">
                    TB
                  </div>
                  <div>
                    <div className="text-xs text-gray-900">Tom Barr</div>
                    <div className="text-[10px] text-gray-500">tom@titanbanking.ai</div>
                  </div>
                </div>
              </Row>
            </Section>
          </div>

          {/* Skeleton */}
          <div id="skeleton">
            <Section title="Skeleton" description="Loading placeholder that mimics content shape.">
              <Row label="Text lines">
                <div className="space-y-2 w-64">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </Row>
              <Row label="Card">
                <div className="space-y-3 w-64 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </Row>
            </Section>
          </div>

          {/* Separator */}
          <div id="separator">
            <Section title="Separator" description="Visual divider between content sections.">
              <div className="space-y-4 max-w-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Horizontal</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm text-gray-700">Section one</p>
                    <Separator />
                    <p className="text-sm text-gray-700">Section two</p>
                    <Separator />
                    <p className="text-sm text-gray-700">Section three</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Vertical</p>
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4">
                    <span className="text-sm text-gray-700">Left</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm text-gray-700">Middle</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm text-gray-700">Right</span>
                  </div>
                </div>
              </div>
            </Section>
          </div>

        </div>
      </div>
    </div>
  );
}
