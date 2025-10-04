import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { ModuleQuiz } from './ModuleQuiz'
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  BookOpen,
  Clock,
  PlayCircle,
  Trophy,
  Target,
  Brain,
  Eye,
  List,
  Certificate as CertificateIcon
} from '@phosphor-icons/react'

interface ModulePage {
  id: string
  title: string
  content: string
  type: 'text' | 'video' | 'interactive' | 'simulation'
  duration: number
  mediaUrl?: string
  interactiveElements?: any[]
}

interface ModuleContent {
  id: string
  title: string
  description: string
  pages: ModulePage[]
  quiz: {
    questions: Array<{
      id: string
      question: string
      options: string[]
      correctAnswer: number
      explanation: string
    }>
    passingScore: number
  }
  certification: {
    enabled: boolean
    certificateType: 'completion' | 'achievement' | 'mastery'
    requiredScore: number
  }
}

interface ModuleProgress {
  moduleId: string
  currentPage: number
  completedPages: number[]
  quizScore?: number
  completed: boolean
  timeSpent: number
  lastAccessed: string
}

interface ModuleContentViewerProps {
  moduleId: string
  onBack: () => void
  onComplete: (moduleId: string, score: number) => void
}

export function ModuleContentViewer({ moduleId, onBack, onComplete }: ModuleContentViewerProps) {
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [progress, setProgress] = useKV<ModuleProgress[]>('module-progress', [])
  const [loading, setLoading] = useState(true)

  // Enhanced module content with more variety
  const moduleData: Record<string, ModuleContent> = {
    'cybersecurity-fundamentals': {
      id: 'cybersecurity-fundamentals',
      title: 'Cybersecurity Fundamentals',
      description: 'Master the core principles and concepts of cybersecurity',
      pages: [
        {
          id: 'intro',
          title: 'Introduction to Cybersecurity',
          content: `
            <h2>Welcome to Cybersecurity Fundamentals</h2>
            <p>In today's digital world, cybersecurity has become one of the most critical aspects of technology and business operations. This comprehensive module will introduce you to the fundamental concepts that form the backbone of information security.</p>
            
            <h3>What You'll Learn</h3>
            <ul>
              <li>The CIA Triad: Confidentiality, Integrity, and Availability</li>
              <li>Common cybersecurity threats and vulnerabilities</li>
              <li>Risk assessment and management principles</li>
              <li>Security frameworks and compliance standards</li>
            </ul>
            
            <h3>Why Cybersecurity Matters</h3>
            <p>With cyber attacks increasing by 67% over the last 5 years, organizations need skilled cybersecurity professionals more than ever. This field offers:</p>
            <ul>
              <li>High-demand career opportunities</li>
              <li>Excellent salary potential</li>
              <li>Intellectual challenges and continuous learning</li>
              <li>The satisfaction of protecting critical systems and data</li>
            </ul>
          `,
          type: 'text',
          duration: 15
        },
        {
          id: 'cia-triad',
          title: 'The CIA Triad',
          content: `
            <h2>The CIA Triad: Foundation of Information Security</h2>
            <p>The CIA Triad is the fundamental model that guides information security policies within organizations. It consists of three core principles:</p>
            
            <h3>🔒 Confidentiality</h3>
            <p>Ensures that information is accessible only to those authorized to access it. This involves:</p>
            <ul>
              <li>Access controls and authentication</li>
              <li>Encryption of sensitive data</li>
              <li>Data classification and handling procedures</li>
              <li>Privacy protection measures</li>
            </ul>
            
            <h3>🛡️ Integrity</h3>
            <p>Maintains the accuracy and completeness of data and systems. Key aspects include:</p>
            <ul>
              <li>Data validation and verification</li>
              <li>Digital signatures and hashing</li>
              <li>Version control and change management</li>
              <li>Protection against unauthorized modifications</li>
            </ul>
            
            <h3>⚡ Availability</h3>
            <p>Ensures that information and resources are accessible when needed. This involves:</p>
            <ul>
              <li>System redundancy and backup strategies</li>
              <li>Disaster recovery planning</li>
              <li>Performance monitoring and maintenance</li>
              <li>DDoS protection and mitigation</li>
            </ul>
            
            <div class="interactive-section">
              <h4>💡 Real-World Example</h4>
              <p>Consider a banking system:</p>
              <ul>
                <li><strong>Confidentiality:</strong> Customer account information is encrypted and only accessible to authorized personnel</li>
                <li><strong>Integrity:</strong> Transaction records cannot be altered without proper authorization and audit trails</li>
                <li><strong>Availability:</strong> The banking system must be accessible 24/7 for customer transactions</li>
              </ul>
            </div>
          `,
          type: 'interactive',
          duration: 20
        },
        {
          id: 'threat-landscape',
          title: 'Understanding the Threat Landscape',
          content: `
            <h2>Modern Cybersecurity Threats</h2>
            <p>Understanding the current threat landscape is crucial for developing effective security strategies. Let's explore the most common types of cyber threats:</p>
            
            <h3>🦠 Malware</h3>
            <p>Malicious software designed to damage, disrupt, or gain unauthorized access to systems:</p>
            <ul>
              <li><strong>Viruses:</strong> Self-replicating programs that attach to other files</li>
              <li><strong>Trojans:</strong> Disguised malicious software that appears legitimate</li>
              <li><strong>Ransomware:</strong> Encrypts files and demands payment for decryption</li>
              <li><strong>Spyware:</strong> Secretly monitors and collects user information</li>
            </ul>
            
            <h3>🎣 Social Engineering</h3>
            <p>Psychological manipulation to trick people into divulging confidential information:</p>
            <ul>
              <li><strong>Phishing:</strong> Fraudulent emails attempting to steal credentials</li>
              <li><strong>Spear Phishing:</strong> Targeted phishing attacks on specific individuals</li>
              <li><strong>Pretexting:</strong> Creating false scenarios to gain trust</li>
              <li><strong>Baiting:</strong> Offering something enticing to spark curiosity</li>
            </ul>
            
            <h3>💻 Network Attacks</h3>
            <p>Attacks targeting network infrastructure and communications:</p>
            <ul>
              <li><strong>DDoS:</strong> Overwhelming systems with traffic to cause downtime</li>
              <li><strong>Man-in-the-Middle:</strong> Intercepting communications between parties</li>
              <li><strong>SQL Injection:</strong> Exploiting database vulnerabilities</li>
              <li><strong>Zero-day Exploits:</strong> Attacks using unknown vulnerabilities</li>
            </ul>
            
            <div class="statistics-box">
              <h4>📊 2024 Threat Statistics</h4>
              <ul>
                <li>Ransomware attacks increased by 41% year-over-year</li>
                <li>95% of successful cyber attacks are due to human error</li>
                <li>The average cost of a data breach is $4.45 million</li>
                <li>It takes an average of 277 days to identify and contain a breach</li>
              </ul>
            </div>
          `,
          type: 'text',
          duration: 25
        },
        {
          id: 'risk-management',
          title: 'Risk Assessment and Management',
          content: `
            <h2>Cybersecurity Risk Management</h2>
            <p>Effective risk management is essential for maintaining a strong security posture. It involves identifying, analyzing, and mitigating potential threats to your organization.</p>
            
            <h3>🎯 Risk Assessment Process</h3>
            <ol>
              <li><strong>Asset Identification:</strong> Catalog all valuable assets (data, systems, applications)</li>
              <li><strong>Threat Identification:</strong> Identify potential threats to each asset</li>
              <li><strong>Vulnerability Assessment:</strong> Find weaknesses that could be exploited</li>
              <li><strong>Impact Analysis:</strong> Evaluate potential consequences of security incidents</li>
              <li><strong>Risk Calculation:</strong> Determine risk levels using probability and impact</li>
            </ol>
            
            <h3>📊 Risk Matrix</h3>
            <p>Risks are typically categorized using a matrix based on:</p>
            <ul>
              <li><strong>Likelihood:</strong> How probable is the threat? (Low, Medium, High)</li>
              <li><strong>Impact:</strong> What would be the consequences? (Low, Medium, High, Critical)</li>
            </ul>
            
            <h3>🛡️ Risk Mitigation Strategies</h3>
            <p>Once risks are identified, you can choose from several mitigation approaches:</p>
            <ul>
              <li><strong>Accept:</strong> Acknowledge the risk and decide to live with it</li>
              <li><strong>Avoid:</strong> Eliminate the risk by removing the threat source</li>
              <li><strong>Mitigate:</strong> Reduce the likelihood or impact of the risk</li>
              <li><strong>Transfer:</strong> Share the risk with another party (insurance, outsourcing)</li>
            </ul>
            
            <div class="practical-exercise">
              <h4>🎓 Practical Exercise</h4>
              <p>Consider a small business with the following assets:</p>
              <ul>
                <li>Customer database with 10,000 records</li>
                <li>E-commerce website processing payments</li>
                <li>Email system for business communications</li>
              </ul>
              <p>What are the main threats to each asset? How would you prioritize them?</p>
            </div>
          `,
          type: 'interactive',
          duration: 30
        },
        {
          id: 'security-frameworks',
          title: 'Security Frameworks and Standards',
          content: `
            <h2>Cybersecurity Frameworks and Standards</h2>
            <p>Security frameworks provide structured approaches to managing cybersecurity risks and implementing best practices across organizations.</p>
            
            <h3>🏛️ NIST Cybersecurity Framework</h3>
            <p>The most widely adopted framework, consisting of five core functions:</p>
            <ul>
              <li><strong>Identify:</strong> Understand your business context, resources, and risks</li>
              <li><strong>Protect:</strong> Implement safeguards to ensure delivery of critical services</li>
              <li><strong>Detect:</strong> Develop activities to identify cybersecurity events</li>
              <li><strong>Respond:</strong> Take action regarding detected cybersecurity incidents</li>
              <li><strong>Recover:</strong> Maintain resilience plans and restore capabilities</li>
            </ul>
            
            <h3>🌐 ISO 27001</h3>
            <p>International standard for information security management systems (ISMS):</p>
            <ul>
              <li>Provides a systematic approach to managing sensitive information</li>
              <li>Includes people, processes, and IT systems</li>
              <li>Based on risk management and continuous improvement</li>
              <li>Internationally recognized certification available</li>
            </ul>
            
            <h3>⚖️ Compliance Standards</h3>
            <p>Industry-specific regulations that organizations must follow:</p>
            <ul>
              <li><strong>PCI DSS:</strong> Payment Card Industry Data Security Standard</li>
              <li><strong>HIPAA:</strong> Health Insurance Portability and Accountability Act</li>
              <li><strong>GDPR:</strong> General Data Protection Regulation (EU)</li>
              <li><strong>SOX:</strong> Sarbanes-Oxley Act (Financial reporting)</li>
            </ul>
            
            <h3>🔧 Implementation Benefits</h3>
            <p>Adopting security frameworks provides:</p>
            <ul>
              <li>Structured approach to cybersecurity</li>
              <li>Common language for discussing security issues</li>
              <li>Measurable security improvements</li>
              <li>Regulatory compliance support</li>
              <li>Enhanced stakeholder confidence</li>
            </ul>
            
            <div class="framework-comparison">
              <h4>📋 Framework Selection Guide</h4>
              <p>Choose the right framework based on:</p>
              <ul>
                <li>Organization size and complexity</li>
                <li>Industry requirements and regulations</li>
                <li>Available resources and expertise</li>
                <li>Business objectives and risk tolerance</li>
              </ul>
            </div>
          `,
          type: 'text',
          duration: 25
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What does the "C" in CIA Triad stand for?',
            options: ['Cyber-security', 'Confidentiality', 'Compliance', 'Control'],
            correctAnswer: 1,
            explanation: 'Confidentiality ensures that information is accessible only to those authorized to access it.'
          },
          {
            id: 'q2',
            question: 'Which type of malware encrypts files and demands payment?',
            options: ['Virus', 'Trojan', 'Ransomware', 'Spyware'],
            correctAnswer: 2,
            explanation: 'Ransomware encrypts files and demands payment for decryption keys.'
          },
          {
            id: 'q3',
            question: 'What is the first step in the risk assessment process?',
            options: ['Threat Identification', 'Asset Identification', 'Vulnerability Assessment', 'Impact Analysis'],
            correctAnswer: 1,
            explanation: 'Asset identification is the first step - you need to know what you\'re protecting before assessing threats.'
          },
          {
            id: 'q4',
            question: 'Which NIST Framework function involves taking action on detected incidents?',
            options: ['Identify', 'Protect', 'Detect', 'Respond'],
            correctAnswer: 3,
            explanation: 'The Respond function involves taking action regarding detected cybersecurity incidents.'
          },
          {
            id: 'q5',
            question: 'What percentage of successful cyber attacks are due to human error?',
            options: ['75%', '85%', '95%', '100%'],
            correctAnswer: 2,
            explanation: '95% of successful cyber attacks are due to human error, highlighting the importance of security awareness training.'
          }
        ],
        passingScore: 80
      },
      certification: {
        enabled: true,
        certificateType: 'completion',
        requiredScore: 80
      }
    },
    'network-security': {
      id: 'network-security',
      title: 'Network Security Essentials',
      description: 'Comprehensive guide to securing network infrastructure',
      pages: [
        {
          id: 'network-basics',
          title: 'Network Security Fundamentals',
          content: `
            <h2>Network Security Fundamentals</h2>
            <p>Network security involves protecting the integrity, confidentiality, and availability of data as it travels across or is stored in networks. This includes both hardware and software technologies.</p>
            
            <h3>🌐 Network Architecture Security</h3>
            <p>Understanding network architecture is crucial for implementing effective security:</p>
            <ul>
              <li><strong>Perimeter Security:</strong> First line of defense at network boundaries</li>
              <li><strong>Internal Segmentation:</strong> Dividing networks into smaller, manageable segments</li>
              <li><strong>Zero Trust Model:</strong> Never trust, always verify approach</li>
              <li><strong>Defense in Depth:</strong> Multiple layers of security controls</li>
            </ul>
            
            <h3>🔧 Common Network Protocols</h3>
            <p>Key protocols and their security implications:</p>
            <ul>
              <li><strong>TCP/IP:</strong> Foundation of internet communication</li>
              <li><strong>HTTP/HTTPS:</strong> Web communication protocols</li>
              <li><strong>DNS:</strong> Domain name resolution system</li>
              <li><strong>DHCP:</strong> Dynamic IP address assignment</li>
              <li><strong>SSH:</strong> Secure shell for remote access</li>
            </ul>
          `,
          type: 'text',
          duration: 20
        },
        {
          id: 'firewalls',
          title: 'Firewalls and Access Control',
          content: `
            <h2>Firewalls: Your Network's First Line of Defense</h2>
            <p>Firewalls are network security devices that monitor and control incoming and outgoing network traffic based on predetermined security rules.</p>
            
            <h3>🛡️ Types of Firewalls</h3>
            <ul>
              <li><strong>Packet-Filtering:</strong> Examines packets at network layer</li>
              <li><strong>Stateful Inspection:</strong> Tracks connection states</li>
              <li><strong>Application Layer:</strong> Inspects application-specific data</li>
              <li><strong>Next-Generation (NGFW):</strong> Advanced threat detection</li>
            </ul>
            
            <h3>⚙️ Firewall Configuration Best Practices</h3>
            <ul>
              <li>Default deny policy</li>
              <li>Regular rule review and cleanup</li>
              <li>Logging and monitoring</li>
              <li>Regular updates and patches</li>
            </ul>
          `,
          type: 'interactive',
          duration: 25
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What security model follows the principle "never trust, always verify"?',
            options: ['Defense in Depth', 'Zero Trust', 'Perimeter Security', 'Network Segmentation'],
            correctAnswer: 1,
            explanation: 'Zero Trust model follows the principle of never trusting and always verifying, regardless of location.'
          },
          {
            id: 'q2',
            question: 'Which type of firewall examines packets at the network layer?',
            options: ['Application Layer', 'Stateful Inspection', 'Packet-Filtering', 'Next-Generation'],
            correctAnswer: 2,
            explanation: 'Packet-filtering firewalls examine packets at the network layer, checking headers for source/destination addresses and ports.'
          }
        ],
        passingScore: 80
      },
      certification: {
        enabled: true,
        certificateType: 'achievement',
        requiredScore: 85
      }
    },
    'ethical-hacking': {
      id: 'ethical-hacking',
      title: 'Ethical Hacking & Penetration Testing',
      description: 'Learn authorized security testing methodologies',
      pages: [
        {
          id: 'intro-ethical-hacking',
          title: 'Introduction to Ethical Hacking',
          content: `
            <h2>What is Ethical Hacking?</h2>
            <p>Ethical hacking, also known as "white hat" hacking, involves authorized attempts to gain unauthorized access to systems to identify security vulnerabilities.</p>
            
            <h3>🎯 Core Principles</h3>
            <ul>
              <li><strong>Authorization:</strong> Always get explicit permission</li>
              <li><strong>Scope:</strong> Stay within defined boundaries</li>
              <li><strong>Documentation:</strong> Record all findings</li>
              <li><strong>Responsible Disclosure:</strong> Report vulnerabilities properly</li>
            </ul>
            
            <h3>🔍 Penetration Testing Phases</h3>
            <ol>
              <li><strong>Reconnaissance:</strong> Information gathering</li>
              <li><strong>Scanning:</strong> System and service discovery</li>
              <li><strong>Enumeration:</strong> Detailed target analysis</li>
              <li><strong>Exploitation:</strong> Attempting to gain access</li>
              <li><strong>Reporting:</strong> Documenting findings and remediation</li>
            </ol>
          `,
          type: 'text',
          duration: 20
        },
        {
          id: 'tools-techniques',
          title: 'Common Tools and Techniques',
          content: `
            <h2>Essential Ethical Hacking Tools</h2>
            <p>Professional penetration testers rely on various tools to assess security posture effectively.</p>
            
            <h3>🔧 Reconnaissance Tools</h3>
            <ul>
              <li><strong>Nmap:</strong> Network discovery and port scanning</li>
              <li><strong>Nslookup/Dig:</strong> DNS information gathering</li>
              <li><strong>Whois:</strong> Domain registration information</li>
              <li><strong>Maltego:</strong> Visual link analysis</li>
            </ul>
            
            <h3>⚡ Vulnerability Scanners</h3>
            <ul>
              <li><strong>Nessus:</strong> Comprehensive vulnerability scanner</li>
              <li><strong>OpenVAS:</strong> Open-source vulnerability assessment</li>
              <li><strong>Burp Suite:</strong> Web application security testing</li>
              <li><strong>OWASP ZAP:</strong> Free security testing proxy</li>
            </ul>
            
            <div class="warning-box">
              <h4>⚠️ Legal and Ethical Considerations</h4>
              <p>Never use these tools without proper authorization. Unauthorized access is illegal and unethical.</p>
            </div>
          `,
          type: 'interactive',
          duration: 25
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the first principle of ethical hacking?',
            options: ['Documentation', 'Authorization', 'Exploitation', 'Reporting'],
            correctAnswer: 1,
            explanation: 'Authorization is fundamental - you must always get explicit permission before conducting any security testing.'
          },
          {
            id: 'q2',
            question: 'Which tool is primarily used for network discovery and port scanning?',
            options: ['Burp Suite', 'Nmap', 'Maltego', 'OpenVAS'],
            correctAnswer: 1,
            explanation: 'Nmap (Network Mapper) is the standard tool for network discovery and port scanning.'
          }
        ],
        passingScore: 85
      },
      certification: {
        enabled: true,
        certificateType: 'mastery',
        requiredScore: 90
      }
    },
    'incident-response': {
      id: 'incident-response',
      title: 'Incident Response & Digital Forensics',
      description: 'Handle security incidents and conduct digital investigations',
      pages: [
        {
          id: 'incident-fundamentals',
          title: 'Incident Response Fundamentals',
          content: `
            <h2>Cybersecurity Incident Response</h2>
            <p>Incident response is the systematic approach to handling and managing the aftermath of a security breach or cyberattack.</p>
            
            <h3>🚨 Incident Response Lifecycle</h3>
            <ol>
              <li><strong>Preparation:</strong> Develop plans, train teams, establish tools</li>
              <li><strong>Identification:</strong> Detect and analyze potential incidents</li>
              <li><strong>Containment:</strong> Limit damage and prevent spread</li>
              <li><strong>Eradication:</strong> Remove threats and vulnerabilities</li>
              <li><strong>Recovery:</strong> Restore systems to normal operations</li>
              <li><strong>Lessons Learned:</strong> Review and improve processes</li>
            </ol>
            
            <h3>👥 Incident Response Team Roles</h3>
            <ul>
              <li><strong>Incident Commander:</strong> Overall response coordination</li>
              <li><strong>Security Analyst:</strong> Technical investigation and analysis</li>
              <li><strong>Forensics Specialist:</strong> Evidence collection and analysis</li>
              <li><strong>Communications Lead:</strong> Internal and external communications</li>
              <li><strong>Legal Counsel:</strong> Legal implications and compliance</li>
            </ul>
          `,
          type: 'text',
          duration: 22
        },
        {
          id: 'digital-forensics',
          title: 'Digital Forensics Basics',
          content: `
            <h2>Digital Forensics Investigation</h2>
            <p>Digital forensics involves the recovery and investigation of material found in digital devices, often in relation to cybercrime.</p>
            
            <h3>🔍 Forensics Process</h3>
            <ol>
              <li><strong>Identification:</strong> Recognize and prioritize evidence sources</li>
              <li><strong>Preservation:</strong> Protect evidence from contamination</li>
              <li><strong>Collection:</strong> Gather evidence using proper procedures</li>
              <li><strong>Examination:</strong> Process and extract relevant information</li>
              <li><strong>Analysis:</strong> Interpret findings and draw conclusions</li>
              <li><strong>Presentation:</strong> Report findings clearly and accurately</li>
            </ol>
            
            <h3>💾 Types of Digital Evidence</h3>
            <ul>
              <li><strong>Computer Systems:</strong> Hard drives, memory, system logs</li>
              <li><strong>Mobile Devices:</strong> Smartphones, tablets, GPS devices</li>
              <li><strong>Network Data:</strong> Traffic logs, firewall records, IDS alerts</li>
              <li><strong>Cloud Services:</strong> Email, storage, application data</li>
            </ul>
            
            <div class="best-practice">
              <h4>📋 Chain of Custody</h4>
              <p>Maintaining proper documentation of evidence handling is crucial for legal proceedings.</p>
            </div>
          `,
          type: 'interactive',
          duration: 28
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the first phase of the incident response lifecycle?',
            options: ['Identification', 'Preparation', 'Containment', 'Recovery'],
            correctAnswer: 1,
            explanation: 'Preparation is the first phase, involving developing plans, training teams, and establishing tools before incidents occur.'
          },
          {
            id: 'q2',
            question: 'What does "chain of custody" refer to in digital forensics?',
            options: ['Evidence storage', 'Documentation of evidence handling', 'Analysis tools', 'Legal procedures'],
            correctAnswer: 1,
            explanation: 'Chain of custody refers to the documentation that records the sequence of custody, control, transfer, analysis, and disposition of evidence.'
          }
        ],
        passingScore: 80
      },
      certification: {
        enabled: true,
        certificateType: 'achievement',
        requiredScore: 85
      }
    },
    'cloud-security': {
      id: 'cloud-security',
      title: 'Cloud Security Architecture',
      description: 'Secure cloud environments and services effectively',
      pages: [
        {
          id: 'cloud-basics',
          title: 'Cloud Security Fundamentals',
          content: `
            <h2>Understanding Cloud Security</h2>
            <p>Cloud security encompasses the technologies, policies, controls, and services that protect cloud data, applications, and infrastructure from threats.</p>
            
            <h3>☁️ Cloud Service Models</h3>
            <ul>
              <li><strong>IaaS (Infrastructure as a Service):</strong> Virtual machines, storage, networks</li>
              <li><strong>PaaS (Platform as a Service):</strong> Development platforms and tools</li>
              <li><strong>SaaS (Software as a Service):</strong> Complete applications and services</li>
            </ul>
            
            <h3>🔒 Shared Responsibility Model</h3>
            <p>Security responsibilities are shared between cloud provider and customer:</p>
            <ul>
              <li><strong>Provider Responsibility:</strong> Physical security, infrastructure, hypervisor</li>
              <li><strong>Customer Responsibility:</strong> Data, applications, operating systems, network controls</li>
            </ul>
            
            <h3>🌐 Cloud Deployment Models</h3>
            <ul>
              <li><strong>Public Cloud:</strong> Shared infrastructure, cost-effective</li>
              <li><strong>Private Cloud:</strong> Dedicated infrastructure, enhanced control</li>
              <li><strong>Hybrid Cloud:</strong> Combination of public and private</li>
              <li><strong>Multi-Cloud:</strong> Multiple cloud providers</li>
            </ul>
          `,
          type: 'text',
          duration: 20
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'In the shared responsibility model, who is responsible for data security?',
            options: ['Cloud provider only', 'Customer only', 'Both provider and customer', 'Third-party vendors'],
            correctAnswer: 1,
            explanation: 'In the shared responsibility model, the customer is responsible for securing their data, regardless of the service model.'
          }
        ],
        passingScore: 80
      },
      certification: {
        enabled: true,
        certificateType: 'completion',
        requiredScore: 80
      }
    }
  }

  useEffect(() => {
    const loadModule = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const content = moduleData[moduleId]
      if (content) {
        setModuleContent(content)
        
        // Load existing progress
        const existingProgress = progress?.find(p => p.moduleId === moduleId)
        if (existingProgress) {
          setCurrentPageIndex(existingProgress.currentPage)
        }
      }
      setLoading(false)
    }

    if (moduleId) {
      loadModule()
    }
  }, [moduleId, progress])

  const updateProgress = (updates: Partial<ModuleProgress>) => {
    setProgress(prev => {
      const currentList = prev || []
      const existingIndex = currentList.findIndex(p => p.moduleId === moduleId)
      
      const updatedProgress: ModuleProgress = {
        moduleId,
        currentPage: currentPageIndex,
        completedPages: [],
        completed: false,
        timeSpent: 0,
        lastAccessed: new Date().toISOString(),
        ...updates
      }

      if (existingIndex >= 0) {
        const newList = [...currentList]
        newList[existingIndex] = { ...currentList[existingIndex], ...updatedProgress }
        return newList
      } else {
        return [...currentList, updatedProgress]
      }
    })
  }

  const handleNextPage = () => {
    if (!moduleContent) return

    const newCompletedPages = [...(getCurrentProgress()?.completedPages || []), currentPageIndex]
    updateProgress({
      currentPage: currentPageIndex + 1,
      completedPages: Array.from(new Set(newCompletedPages))
    })

    if (currentPageIndex >= moduleContent.pages.length - 1) {
      setShowQuiz(true)
    } else {
      setCurrentPageIndex(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1)
      updateProgress({ currentPage: currentPageIndex - 1 })
    }
  }

  const handleQuizComplete = (score: number) => {
    const passed = score >= moduleContent!.quiz.passingScore
    
    updateProgress({
      quizScore: score,
      completed: passed,
      completedPages: moduleContent!.pages.map((_, index) => index)
    })

    if (passed) {
      toast.success(`🎉 Congratulations! You passed with ${score}%`)
      onComplete(moduleId, score)
    } else {
      toast.error(`You scored ${score}%. You need ${moduleContent!.quiz.passingScore}% to pass. Try again!`)
      setShowQuiz(false)
    }
  }

  const getCurrentProgress = () => {
    return progress?.find(p => p.moduleId === moduleId)
  }

  const getProgressPercentage = () => {
    if (!moduleContent) return 0
    const currentProgress = getCurrentProgress()
    const completedPages = currentProgress?.completedPages?.length || 0
    const totalPages = moduleContent.pages.length
    return Math.round((completedPages / totalPages) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <BookOpen size={48} className="text-primary" />
          </motion.div>
          <p className="text-lg text-muted-foreground">Loading module content...</p>
        </div>
      </div>
    )
  }

  if (!moduleContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <div className="text-destructive">
              <Target size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold">Module Not Found</h3>
            <p className="text-muted-foreground">The requested module could not be loaded.</p>
            <Button onClick={onBack}>Return to Modules</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showQuiz) {
    return (
      <ModuleQuiz
        questions={moduleContent.quiz.questions}
        passingScore={moduleContent.quiz.passingScore}
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
        moduleTitle={moduleContent.title}
      />
    )
  }

  const currentPage = moduleContent.pages[currentPageIndex]
  const isLastPage = currentPageIndex >= moduleContent.pages.length - 1

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <BookOpen size={20} className="text-primary" />
                <div>
                  <h1 className="text-xl font-bold">{moduleContent.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Page {currentPageIndex + 1} of {moduleContent.pages.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{currentPage.duration} min</span>
              </Badge>
              <div className="text-sm text-muted-foreground">
                {getProgressPercentage()}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPageIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden">
                {/* Background animation based on content type */}
                {currentPage.type === 'interactive' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"
                    animate={{ 
                      background: [
                        "linear-gradient(45deg, rgba(59, 130, 246, 0.03), transparent, rgba(139, 92, 246, 0.03))",
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.03), transparent, rgba(59, 130, 246, 0.03))"
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                )}

                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{currentPage.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        {currentPage.type}
                      </Badge>
                      {currentPage.type === 'interactive' && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          ✨ Interactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 prose prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: currentPage.content }}
                    className="space-y-6"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPageIndex === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-1">
              {moduleContent.pages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentPageIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  animate={{
                    scale: index === currentPageIndex ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>

            <Button
              onClick={handleNextPage}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent"
            >
              {isLastPage ? (
                <>
                  <Trophy size={16} />
                  <span>Take Quiz</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}