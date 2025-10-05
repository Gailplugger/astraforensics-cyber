import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { ModuleQuiz } from './ModuleQuiz'
import { SparkLoader } from './SparkLoader'
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
  Certificate as CertificateIcon,
  Star,
  User,
  Shield,
  Network,
  Bug,
  Database,
  CloudCheck
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

  // Enhanced module content with more comprehensive details
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
            <div class="learning-content">
              <h2>🛡️ Welcome to Cybersecurity Fundamentals</h2>
              <p class="lead-text">In today's interconnected digital world, cybersecurity has become one of the most critical aspects of technology and business operations. This comprehensive module will introduce you to the fundamental concepts that form the backbone of information security.</p>
              
              <div class="highlight-box">
                <h3>📊 Industry Snapshot 2024</h3>
                <ul>
                  <li>Global cybersecurity market worth <strong>$173.5 billion</strong></li>
                  <li>Average cost of a data breach: <strong>$4.45 million</strong></li>
                  <li>3.5 million unfilled cybersecurity jobs worldwide</li>
                  <li>95% of successful attacks are due to human error</li>
                </ul>
              </div>
              
              <h3>🎯 What You'll Master</h3>
              <div class="skills-grid">
                <div class="skill-item">
                  <div class="skill-icon">🔐</div>
                  <h4>CIA Triad Mastery</h4>
                  <p>Deep dive into Confidentiality, Integrity, and Availability principles</p>
                </div>
                <div class="skill-item">
                  <div class="skill-icon">⚠️</div>
                  <h4>Threat Intelligence</h4>
                  <p>Understand modern cybersecurity threats and attack vectors</p>
                </div>
                <div class="skill-item">
                  <div class="skill-icon">📊</div>
                  <h4>Risk Assessment</h4>
                  <p>Learn systematic approaches to risk management</p>
                </div>
                <div class="skill-item">
                  <div class="skill-icon">📋</div>
                  <h4>Security Frameworks</h4>
                  <p>Master industry-standard compliance and governance models</p>
                </div>
              </div>
              
              <h3>🚀 Career Opportunities</h3>
              <p>Cybersecurity professionals are in unprecedented demand across all industries:</p>
              <div class="career-paths">
                <div class="career-card">
                  <h4>🔒 Security Analyst</h4>
                  <p><strong>Avg. Salary:</strong> $99,730/year</p>
                  <p>Monitor security events, investigate incidents, implement protective measures</p>
                </div>
                <div class="career-card">
                  <h4>🕵️ Penetration Tester</h4>
                  <p><strong>Avg. Salary:</strong> $115,780/year</p>
                  <p>Ethical hacking to identify vulnerabilities and strengthen defenses</p>
                </div>
                <div class="career-card">
                  <h4>👨‍💼 Security Manager</h4>
                  <p><strong>Avg. Salary:</strong> $142,530/year</p>
                  <p>Lead security teams, develop strategies, manage enterprise security</p>
                </div>
              </div>
              
              <div class="interactive-element">
                <h4>💡 Did You Know?</h4>
                <p>The first computer virus, "Creeper," was created in 1971 and displayed the message: "I'm the creeper, catch me if you can!" This marked the beginning of our ongoing battle against cyber threats.</p>
              </div>
            </div>
          `,
          type: 'interactive',
          duration: 15
        },
        {
          id: 'cia-triad',
          title: 'The CIA Triad: Foundation of Security',
          content: `
            <div class="learning-content">
              <h2>🔐 The CIA Triad: Foundation of Information Security</h2>
              <p class="lead-text">The CIA Triad forms the cornerstone of information security policy and practice. Every security decision should consider these three fundamental principles.</p>
              
              <div class="triad-container">
                <div class="triad-element confidentiality">
                  <div class="triad-icon">🔒</div>
                  <h3>Confidentiality</h3>
                  <p class="principle-desc">Ensures information is accessible only to authorized individuals, entities, or processes.</p>
                  
                  <h4>🛠️ Implementation Techniques:</h4>
                  <ul>
                    <li><strong>Encryption:</strong> AES-256, RSA, elliptic curve cryptography</li>
                    <li><strong>Access Controls:</strong> Role-based (RBAC), attribute-based (ABAC)</li>
                    <li><strong>Authentication:</strong> Multi-factor authentication (MFA), biometrics</li>
                    <li><strong>Data Classification:</strong> Public, internal, confidential, restricted</li>
                    <li><strong>Privacy Controls:</strong> Data anonymization, pseudonymization</li>
                  </ul>
                  
                  <div class="real-world-example">
                    <h5>🏥 Healthcare Example:</h5>
                    <p>Patient medical records are encrypted at rest and in transit. Only authorized healthcare providers with valid credentials can access specific patient information based on their role and need-to-know basis.</p>
                  </div>
                </div>
                
                <div class="triad-element integrity">
                  <div class="triad-icon">🛡️</div>
                  <h3>Integrity</h3>
                  <p class="principle-desc">Maintains accuracy, completeness, and consistency of data throughout its lifecycle.</p>
                  
                  <h4>🛠️ Implementation Techniques:</h4>
                  <ul>
                    <li><strong>Hashing:</strong> SHA-256, MD5 checksums for data verification</li>
                    <li><strong>Digital Signatures:</strong> PKI-based authentication and non-repudiation</li>
                    <li><strong>Version Control:</strong> Git, SVN for change tracking</li>
                    <li><strong>Input Validation:</strong> Sanitization, whitelisting, bounds checking</li>
                    <li><strong>Audit Trails:</strong> Comprehensive logging and monitoring</li>
                  </ul>
                  
                  <div class="real-world-example">
                    <h5>🏦 Financial Example:</h5>
                    <p>Banking transactions use digital signatures and checksums to ensure no unauthorized modifications. Each transaction is logged with immutable timestamps and cannot be altered without detection.</p>
                  </div>
                </div>
                
                <div class="triad-element availability">
                  <div class="triad-icon">⚡</div>
                  <h3>Availability</h3>
                  <p class="principle-desc">Ensures information and resources are accessible when needed by authorized users.</p>
                  
                  <h4>🛠️ Implementation Techniques:</h4>
                  <ul>
                    <li><strong>Redundancy:</strong> Load balancing, failover systems, clustering</li>
                    <li><strong>Backup Strategies:</strong> 3-2-1 rule, incremental, differential backups</li>
                    <li><strong>Disaster Recovery:</strong> RTO, RPO planning, business continuity</li>
                    <li><strong>DDoS Protection:</strong> Rate limiting, traffic filtering, CDNs</li>
                    <li><strong>Monitoring:</strong> 24/7 SOC, automated alerting, health checks</li>
                  </ul>
                  
                  <div class="real-world-example">
                    <h5>☁️ Cloud Service Example:</h5>
                    <p>Major cloud providers maintain 99.99% uptime through geographic redundancy, automatic failover, and real-time monitoring across multiple data centers worldwide.</p>
                  </div>
                </div>
              </div>
              
              <div class="balance-section">
                <h3>⚖️ Balancing the CIA Triad</h3>
                <p>Security professionals must often balance these three principles as they can sometimes conflict:</p>
                <ul>
                  <li><strong>High Confidentiality vs. Availability:</strong> Strong encryption may slow system performance</li>
                  <li><strong>High Integrity vs. Usability:</strong> Strict validation can impact user experience</li>
                  <li><strong>High Availability vs. Security:</strong> Redundant systems may introduce new attack vectors</li>
                </ul>
              </div>
              
              <div class="practical-exercise">
                <h4>🎓 Practical Exercise</h4>
                <p><strong>Scenario:</strong> You're designing security for an e-commerce platform that processes credit card payments.</p>
                <div class="exercise-questions">
                  <p><strong>Question 1:</strong> How would you ensure confidentiality of customer payment data?</p>
                  <p><strong>Question 2:</strong> What measures would maintain transaction integrity?</p>
                  <p><strong>Question 3:</strong> How would you guarantee 99.9% availability during peak shopping seasons?</p>
                </div>
              </div>
            </div>
          `,
          type: 'interactive',
          duration: 25
        },
        {
          id: 'threat-landscape',
          title: 'Modern Cybersecurity Threat Landscape',
          content: `
            <div class="learning-content">
              <h2>🦠 Understanding the Modern Threat Landscape</h2>
              <p class="lead-text">The cybersecurity threat landscape is constantly evolving, with new attack vectors emerging daily. Understanding these threats is crucial for developing effective defense strategies.</p>
              
              <div class="threat-timeline">
                <h3>📈 Evolution of Cyber Threats</h3>
                <div class="timeline-item">
                  <span class="year">1980s</span>
                  <span class="threat">Computer Viruses</span>
                  <span class="impact">Local system infections</span>
                </div>
                <div class="timeline-item">
                  <span class="year">1990s</span>
                  <span class="threat">Internet Worms</span>
                  <span class="impact">Network propagation</span>
                </div>
                <div class="timeline-item">
                  <span class="year">2000s</span>
                  <span class="threat">Botnets & Spam</span>
                  <span class="impact">Coordinated attacks</span>
                </div>
                <div class="timeline-item">
                  <span class="year">2010s</span>
                  <span class="threat">Advanced Persistent Threats</span>
                  <span class="impact">Nation-state attacks</span>
                </div>
                <div class="timeline-item">
                  <span class="year">2020s</span>
                  <span class="threat">AI-Powered Attacks</span>
                  <span class="impact">Automated, targeted threats</span>
                </div>
              </div>
              
              <div class="threat-categories">
                <div class="threat-category malware">
                  <h3>🦠 Malware Evolution</h3>
                  <div class="threat-types">
                    <div class="threat-type">
                      <h4>🔴 Ransomware</h4>
                      <p><strong>Mechanism:</strong> Encrypts files, demands payment</p>
                      <p><strong>Examples:</strong> WannaCry, Ryuk, REvil</p>
                      <p><strong>Impact:</strong> $20 billion in damages (2021)</p>
                      <div class="prevention-tips">
                        <strong>Prevention:</strong>
                        <ul>
                          <li>Regular offline backups (3-2-1 rule)</li>
                          <li>Endpoint detection and response (EDR)</li>
                          <li>Network segmentation</li>
                          <li>Employee training on phishing</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div class="threat-type">
                      <h4>🎭 Trojans & Banking Malware</h4>
                      <p><strong>Mechanism:</strong> Masquerades as legitimate software</p>
                      <p><strong>Examples:</strong> Zeus, Emotet, TrickBot</p>
                      <p><strong>Target:</strong> Financial institutions, credentials</p>
                      <div class="prevention-tips">
                        <strong>Prevention:</strong>
                        <ul>
                          <li>Application whitelisting</li>
                          <li>Behavioral analysis</li>
                          <li>Browser isolation</li>
                          <li>Multi-factor authentication</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div class="threat-type">
                      <h4>🕷️ Advanced Persistent Threats (APTs)</h4>
                      <p><strong>Mechanism:</strong> Long-term, stealthy infiltration</p>
                      <p><strong>Actors:</strong> Nation-states, organized crime</p>
                      <p><strong>Objectives:</strong> Espionage, sabotage, theft</p>
                      <div class="prevention-tips">
                        <strong>Detection:</strong>
                        <ul>
                          <li>Threat hunting programs</li>
                          <li>SIEM with advanced analytics</li>
                          <li>Network traffic analysis</li>
                          <li>Zero-trust architecture</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="threat-category social-engineering">
                  <h3>🎣 Social Engineering Attacks</h3>
                  <p class="category-desc">Psychological manipulation to extract information or gain unauthorized access.</p>
                  
                  <div class="attack-techniques">
                    <div class="technique">
                      <h4>📧 Phishing & Spear Phishing</h4>
                      <ul>
                        <li><strong>Phishing:</strong> Mass emails targeting credentials</li>
                        <li><strong>Spear Phishing:</strong> Targeted attacks on specific individuals</li>
                        <li><strong>Whaling:</strong> Targeting C-level executives</li>
                        <li><strong>Vishing:</strong> Voice-based phishing attacks</li>
                      </ul>
                      <div class="statistics">
                        <p><strong>📊 Statistics:</strong> 83% of organizations experienced phishing attacks in 2022</p>
                      </div>
                    </div>
                    
                    <div class="technique">
                      <h4>🎭 Pretexting & Baiting</h4>
                      <ul>
                        <li><strong>Pretexting:</strong> False scenarios to gain trust</li>
                        <li><strong>Baiting:</strong> Offering rewards to trigger curiosity</li>
                        <li><strong>Quid Pro Quo:</strong> Offering services in exchange for information</li>
                        <li><strong>Tailgating:</strong> Physical unauthorized access</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div class="threat-category network-attacks">
                  <h3>💻 Network-Based Attacks</h3>
                  <div class="network-threat-grid">
                    <div class="network-threat">
                      <h4>⚡ Distributed Denial of Service (DDoS)</h4>
                      <p><strong>Types:</strong> Volumetric, protocol, application layer</p>
                      <p><strong>Scale:</strong> Attacks can exceed 1 Tbps</p>
                      <p><strong>Motivation:</strong> Disruption, extortion, distraction</p>
                    </div>
                    
                    <div class="network-threat">
                      <h4>🔍 Man-in-the-Middle (MitM)</h4>
                      <p><strong>Techniques:</strong> ARP spoofing, DNS hijacking, SSL stripping</p>
                      <p><strong>Targets:</strong> Unencrypted communications</p>
                      <p><strong>Prevention:</strong> End-to-end encryption, certificate pinning</p>
                    </div>
                    
                    <div class="network-threat">
                      <h4>💉 Injection Attacks</h4>
                      <p><strong>SQL Injection:</strong> Database manipulation</p>
                      <p><strong>Command Injection:</strong> OS command execution</p>
                      <p><strong>LDAP Injection:</strong> Directory service attacks</p>
                    </div>
                    
                    <div class="network-threat">
                      <h4>🌐 Zero-Day Exploits</h4>
                      <p><strong>Definition:</strong> Unknown vulnerabilities</p>
                      <p><strong>Market:</strong> $2.5 million for iOS zero-days</p>
                      <p><strong>Defense:</strong> Behavioral analysis, sandboxing</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="emerging-threats">
                <h3>🚀 Emerging Threats 2024</h3>
                <div class="emerging-grid">
                  <div class="emerging-threat">
                    <h4>🤖 AI-Powered Attacks</h4>
                    <ul>
                      <li>Deepfake voice cloning for social engineering</li>
                      <li>AI-generated phishing emails</li>
                      <li>Automated vulnerability discovery</li>
                      <li>Adversarial ML attacks</li>
                    </ul>
                  </div>
                  
                  <div class="emerging-threat">
                    <h4>☁️ Cloud-Native Threats</h4>
                    <ul>
                      <li>Container escape attacks</li>
                      <li>Serverless function abuse</li>
                      <li>API-based attacks</li>
                      <li>Cloud misconfigurations</li>
                    </ul>
                  </div>
                  
                  <div class="emerging-threat">
                    <h4>🔗 Supply Chain Attacks</h4>
                    <ul>
                      <li>SolarWinds-style infiltrations</li>
                      <li>NPM package poisoning</li>
                      <li>Hardware implants</li>
                      <li>Third-party service compromises</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="threat-intelligence">
                <h3>🎯 Threat Intelligence Framework</h3>
                <p>Understanding threats requires systematic intelligence gathering:</p>
                <ol>
                  <li><strong>Collection:</strong> OSINT, dark web monitoring, threat feeds</li>
                  <li><strong>Processing:</strong> Data normalization, correlation, enrichment</li>
                  <li><strong>Analysis:</strong> Pattern recognition, attribution, impact assessment</li>
                  <li><strong>Dissemination:</strong> Actionable intelligence to stakeholders</li>
                  <li><strong>Feedback:</strong> Continuous improvement and validation</li>
                </ol>
              </div>
            </div>
          `,
          type: 'interactive',
          duration: 30
        },
        {
          id: 'risk-management',
          title: 'Cybersecurity Risk Assessment & Management',
          content: `
            <div class="learning-content">
              <h2>🎯 Cybersecurity Risk Assessment & Management</h2>
              <p class="lead-text">Effective risk management is the cornerstone of any successful cybersecurity program. It provides a systematic approach to identifying, analyzing, and mitigating potential threats to your organization.</p>
              
              <div class="risk-framework">
                <h3>📊 Risk Management Framework</h3>
                <div class="framework-steps">
                  <div class="step step-1">
                    <div class="step-number">1</div>
                    <h4>🏢 Asset Identification</h4>
                    <p>Catalog all valuable organizational assets</p>
                    <ul>
                      <li><strong>Information Assets:</strong> Customer data, IP, financial records</li>
                      <li><strong>Technology Assets:</strong> Servers, networks, applications</li>
                      <li><strong>Physical Assets:</strong> Data centers, hardware, facilities</li>
                      <li><strong>Human Assets:</strong> Key personnel, expertise, knowledge</li>
                    </ul>
                  </div>
                  
                  <div class="step step-2">
                    <div class="step-number">2</div>
                    <h4>⚠️ Threat Identification</h4>
                    <p>Identify potential threats to each asset</p>
                    <div class="threat-sources">
                      <div class="threat-source">
                        <h5>👤 Human Threats</h5>
                        <ul>
                          <li>Malicious insiders</li>
                          <li>Social engineering</li>
                          <li>Human error</li>
                          <li>Sabotage</li>
                        </ul>
                      </div>
                      <div class="threat-source">
                        <h5>🌐 External Threats</h5>
                        <ul>
                          <li>Cybercriminals</li>
                          <li>Nation-state actors</li>
                          <li>Hacktivists</li>
                          <li>Competitors</li>
                        </ul>
                      </div>
                      <div class="threat-source">
                        <h5>🌿 Environmental</h5>
                        <ul>
                          <li>Natural disasters</li>
                          <li>Power outages</li>
                          <li>Equipment failure</li>
                          <li>Supply chain disruption</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div class="step step-3">
                    <div class="step-number">3</div>
                    <h4>🔍 Vulnerability Assessment</h4>
                    <p>Find weaknesses that could be exploited</p>
                    <div class="vulnerability-types">
                      <div class="vuln-category">
                        <h5>💻 Technical Vulnerabilities</h5>
                        <ul>
                          <li>Unpatched software</li>
                          <li>Weak configurations</li>
                          <li>Poor code quality</li>
                          <li>Network design flaws</li>
                        </ul>
                      </div>
                      <div class="vuln-category">
                        <h5>📋 Process Vulnerabilities</h5>
                        <ul>
                          <li>Inadequate procedures</li>
                          <li>Lack of training</li>
                          <li>Poor change management</li>
                          <li>Insufficient monitoring</li>
                        </ul>
                      </div>
                      <div class="vuln-category">
                        <h5>🏢 Physical Vulnerabilities</h5>
                        <ul>
                          <li>Unsecured facilities</li>
                          <li>Inadequate access controls</li>
                          <li>Environmental hazards</li>
                          <li>Equipment placement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div class="step step-4">
                    <div class="step-number">4</div>
                    <h4>💥 Impact Analysis</h4>
                    <p>Evaluate potential consequences of security incidents</p>
                    <div class="impact-categories">
                      <div class="impact-type financial">
                        <h5>💰 Financial Impact</h5>
                        <ul>
                          <li>Direct costs (incident response, recovery)</li>
                          <li>Lost revenue (downtime, customer loss)</li>
                          <li>Regulatory fines and penalties</li>
                          <li>Legal costs and litigation</li>
                          <li>Increased insurance premiums</li>
                        </ul>
                      </div>
                      <div class="impact-type operational">
                        <h5>⚙️ Operational Impact</h5>
                        <ul>
                          <li>Service disruption</li>
                          <li>Productivity loss</li>
                          <li>Supply chain interruption</li>
                          <li>Resource reallocation</li>
                        </ul>
                      </div>
                      <div class="impact-type reputational">
                        <h5>📊 Reputational Impact</h5>
                        <ul>
                          <li>Brand damage</li>
                          <li>Customer trust erosion</li>
                          <li>Media coverage</li>
                          <li>Competitive disadvantage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div class="step step-5">
                    <div class="step-number">5</div>
                    <h4>🧮 Risk Calculation</h4>
                    <p>Determine risk levels using probability and impact</p>
                    <div class="risk-formula">
                      <h5>📐 Risk Formula</h5>
                      <div class="formula">
                        <span class="formula-text">Risk = Threat × Vulnerability × Impact</span>
                      </div>
                      <p>Where each factor is rated on a scale (e.g., 1-5 or Low/Medium/High)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="risk-matrix">
                <h3>📊 Risk Assessment Matrix</h3>
                <p>Visualize risk levels based on likelihood and impact:</p>
                <div class="matrix-container">
                  <table class="risk-matrix-table">
                    <thead>
                      <tr>
                        <th>Impact →<br>Likelihood ↓</th>
                        <th>Low</th>
                        <th>Medium</th>
                        <th>High</th>
                        <th>Critical</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="likelihood-label"><strong>High</strong></td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-high">High</td>
                        <td class="risk-critical">Critical</td>
                        <td class="risk-critical">Critical</td>
                      </tr>
                      <tr>
                        <td class="likelihood-label"><strong>Medium</strong></td>
                        <td class="risk-low">Low</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-high">High</td>
                        <td class="risk-critical">Critical</td>
                      </tr>
                      <tr>
                        <td class="likelihood-label"><strong>Low</strong></td>
                        <td class="risk-low">Low</td>
                        <td class="risk-low">Low</td>
                        <td class="risk-medium">Medium</td>
                        <td class="risk-high">High</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="risk-treatment">
                <h3>🛡️ Risk Mitigation Strategies</h3>
                <p>Once risks are identified and assessed, choose appropriate treatment strategies:</p>
                
                <div class="mitigation-strategies">
                  <div class="strategy accept">
                    <h4>✅ Accept</h4>
                    <p><strong>When to use:</strong> Low-impact risks, cost of mitigation exceeds potential loss</p>
                    <p><strong>Requirements:</strong> Formal acceptance by management, monitoring plan</p>
                    <div class="example">
                      <strong>Example:</strong> Accepting risk of minor website defacement due to low business impact
                    </div>
                  </div>
                  
                  <div class="strategy avoid">
                    <h4>🚫 Avoid</h4>
                    <p><strong>When to use:</strong> High-risk activities that can be eliminated</p>
                    <p><strong>Implementation:</strong> Remove threat source, discontinue risky processes</p>
                    <div class="example">
                      <strong>Example:</strong> Discontinuing use of legacy systems with known vulnerabilities
                    </div>
                  </div>
                  
                  <div class="strategy mitigate">
                    <h4>🔧 Mitigate</h4>
                    <p><strong>When to use:</strong> Most common approach for manageable risks</p>
                    <p><strong>Methods:</strong> Reduce likelihood or impact through controls</p>
                    <div class="mitigation-controls">
                      <h5>🛠️ Control Types:</h5>
                      <ul>
                        <li><strong>Preventive:</strong> Firewalls, access controls, encryption</li>
                        <li><strong>Detective:</strong> SIEM, IDS/IPS, monitoring</li>
                        <li><strong>Corrective:</strong> Incident response, backup recovery</li>
                        <li><strong>Administrative:</strong> Policies, training, procedures</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div class="strategy transfer">
                    <h4>🔄 Transfer</h4>
                    <p><strong>When to use:</strong> Risks that can be shared with third parties</p>
                    <p><strong>Methods:</strong> Insurance, outsourcing, contracts</p>
                    <div class="example">
                      <strong>Example:</strong> Cyber insurance to cover financial losses from data breaches
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="practical-scenario">
                <h3>🎓 Practical Risk Assessment Scenario</h3>
                <div class="scenario-box">
                  <h4>📱 Mobile Banking Application Risk Assessment</h4>
                  <p><strong>Organization:</strong> Regional bank with 500,000 customers</p>
                  <p><strong>Asset:</strong> Mobile banking application processing $2B annually</p>
                  
                  <div class="scenario-analysis">
                    <h5>🎯 Key Threats Identified:</h5>
                    <ul>
                      <li>Mobile malware stealing credentials</li>
                      <li>Man-in-the-middle attacks on public WiFi</li>
                      <li>Phishing targeting mobile users</li>
                      <li>Device theft with stored credentials</li>
                    </ul>
                    
                    <h5>🔍 Vulnerabilities Found:</h5>
                    <ul>
                      <li>Weak session management</li>
                      <li>Insufficient certificate pinning</li>
                      <li>Local data storage without encryption</li>
                      <li>Lack of device binding</li>
                    </ul>
                    
                    <h5>💥 Potential Impact:</h5>
                    <ul>
                      <li>$50M+ in fraud losses</li>
                      <li>Regulatory fines up to $25M</li>
                      <li>Customer attrition (15-20%)</li>
                      <li>Reputation damage</li>
                    </ul>
                    
                    <h5>🛡️ Recommended Controls:</h5>
                    <ul>
                      <li>Implement multi-factor authentication</li>
                      <li>Add certificate pinning and SSL/TLS validation</li>
                      <li>Encrypt all local data storage</li>
                      <li>Deploy mobile threat defense solution</li>
                      <li>Enhance user security awareness training</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="continuous-monitoring">
                <h3>📈 Continuous Risk Monitoring</h3>
                <p>Risk management is an ongoing process requiring continuous monitoring and adjustment:</p>
                <ul>
                  <li><strong>Regular assessments:</strong> Quarterly formal reviews, annual comprehensive assessments</li>
                  <li><strong>Threat intelligence integration:</strong> Real-time threat feeds and indicators</li>
                  <li><strong>Control effectiveness testing:</strong> Regular validation of security measures</li>
                  <li><strong>Metrics and KPIs:</strong> Risk trends, control performance, incident rates</li>
                  <li><strong>Management reporting:</strong> Executive dashboards, risk registers, treatment plans</li>
                </ul>
              </div>
            </div>
          `,
          type: 'interactive',
          duration: 35
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What does the "C" in CIA Triad stand for?',
            options: ['Cyber-security', 'Confidentiality', 'Compliance', 'Control'],
            correctAnswer: 1,
            explanation: 'Confidentiality ensures that information is accessible only to those authorized to access it. It\'s the first pillar of the CIA Triad, protecting sensitive data from unauthorized disclosure.'
          },
          {
            id: 'q2',
            question: 'Which type of malware encrypts files and demands payment for decryption?',
            options: ['Virus', 'Trojan', 'Ransomware', 'Spyware'],
            correctAnswer: 2,
            explanation: 'Ransomware is a type of malware that encrypts a victim\'s files and demands payment (usually in cryptocurrency) for the decryption key. Examples include WannaCry and Ryuk.'
          },
          {
            id: 'q3',
            question: 'What is the formula for calculating cybersecurity risk?',
            options: ['Risk = Threat + Vulnerability', 'Risk = Impact × Likelihood', 'Risk = Threat × Vulnerability × Impact', 'Risk = (Threat + Vulnerability) ÷ Impact'],
            correctAnswer: 2,
            explanation: 'The fundamental risk formula is: Risk = Threat × Vulnerability × Impact. This considers the threat actors, system weaknesses, and potential consequences to determine overall risk level.'
          },
          {
            id: 'q4',
            question: 'Which NIST Framework function involves taking action on detected cybersecurity incidents?',
            options: ['Identify', 'Protect', 'Detect', 'Respond'],
            correctAnswer: 3,
            explanation: 'The Respond function involves taking action regarding detected cybersecurity incidents. It includes response planning, communications, analysis, mitigation, and improvements.'
          },
          {
            id: 'q5',
            question: 'What percentage of successful cyber attacks are attributed to human error?',
            options: ['75%', '85%', '95%', '100%'],
            correctAnswer: 2,
            explanation: '95% of successful cyber attacks are due to human error. This highlights the critical importance of security awareness training, proper procedures, and human-centered security design.'
          },
          {
            id: 'q6',
            question: 'Which risk mitigation strategy involves purchasing cyber insurance?',
            options: ['Accept', 'Avoid', 'Mitigate', 'Transfer'],
            correctAnswer: 3,
            explanation: 'Transfer involves sharing risk with third parties, such as through cyber insurance, outsourcing, or contractual agreements. It helps organizations manage financial exposure to cyber risks.'
          },
          {
            id: 'q7',
            question: 'What is the primary difference between phishing and spear phishing?',
            options: ['Technical complexity', 'Target specificity', 'Delivery method', 'Success rate'],
            correctAnswer: 1,
            explanation: 'Spear phishing is targeted at specific individuals or organizations, while regular phishing uses mass, generic attacks. Spear phishing is more sophisticated and personalized.'
          },
          {
            id: 'q8',
            question: 'Which CIA Triad principle is primarily concerned with preventing unauthorized data modification?',
            options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
            correctAnswer: 1,
            explanation: 'Integrity ensures data accuracy and prevents unauthorized modifications. It uses techniques like hashing, digital signatures, and access controls to maintain data consistency.'
          }
        ],
        passingScore: 75
      },
      certification: {
        enabled: true,
        certificateType: 'completion',
        requiredScore: 75
      }
    },
    'network-security': {
      id: 'network-security',
      title: 'Network Security Essentials',
      description: 'Comprehensive guide to securing network infrastructure',
      pages: [
        {
          id: 'network-fundamentals',
          title: 'Network Security Fundamentals',
          content: `
            <div class="learning-content">
              <h2>🌐 Network Security Fundamentals</h2>
              <p class="lead-text">Network security is the practice of securing a computer network from intruders, whether targeted attackers or opportunistic malware. It encompasses both hardware and software technologies and targets a variety of threats.</p>
              
              <div class="network-overview">
                <h3>🏗️ Network Architecture Security</h3>
                <p>Understanding network architecture is crucial for implementing effective security:</p>
                
                <div class="architecture-models">
                  <div class="model-card">
                    <h4>🛡️ Perimeter Security (Traditional)</h4>
                    <ul>
                      <li><strong>Concept:</strong> "Castle and moat" approach</li>
                      <li><strong>Components:</strong> Firewalls, DMZ, VPNs</li>
                      <li><strong>Strengths:</strong> Simple to understand, cost-effective</li>
                      <li><strong>Weaknesses:</strong> Vulnerable to insider threats, assumes trust within perimeter</li>
                    </ul>
                  </div>
                  
                  <div class="model-card highlight">
                    <h4>🎯 Zero Trust Architecture (Modern)</h4>
                    <ul>
                      <li><strong>Principle:</strong> "Never trust, always verify"</li>
                      <li><strong>Components:</strong> Identity verification, device security, continuous monitoring</li>
                      <li><strong>Benefits:</strong> Reduces attack surface, improves visibility</li>
                      <li><strong>Implementation:</strong> Microsegmentation, least privilege access</li>
                    </ul>
                  </div>
                  
                  <div class="model-card">
                    <h4>🔄 Defense in Depth</h4>
                    <ul>
                      <li><strong>Concept:</strong> Multiple layers of security controls</li>
                      <li><strong>Layers:</strong> Physical, network, host, application, data</li>
                      <li><strong>Redundancy:</strong> If one layer fails, others provide protection</li>
                      <li><strong>Integration:</strong> Coordinated security strategy</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="network-protocols">
                <h3>📡 Critical Network Protocols & Security</h3>
                <div class="protocol-grid">
                  <div class="protocol-card">
                    <h4>🔗 TCP/IP Stack Security</h4>
                    <div class="stack-layers">
                      <div class="layer">
                        <strong>Application Layer:</strong> HTTPS, SFTP, SNMP
                        <br><span class="threats">Threats: Application vulnerabilities, protocol exploits</span>
                      </div>
                      <div class="layer">
                        <strong>Transport Layer:</strong> TCP, UDP, TLS
                        <br><span class="threats">Threats: Port scanning, session hijacking</span>
                      </div>
                      <div class="layer">
                        <strong>Network Layer:</strong> IP, ICMP, IPSec
                        <br><span class="threats">Threats: IP spoofing, routing attacks</span>
                      </div>
                      <div class="layer">
                        <strong>Data Link Layer:</strong> Ethernet, WiFi
                        <br><span class="threats">Threats: MAC flooding, ARP poisoning</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="protocol-card">
                    <h4>🔐 Secure Communication Protocols</h4>
                    <ul>
                      <li><strong>TLS/SSL:</strong> Transport Layer Security for encrypted communications</li>
                      <li><strong>IPSec:</strong> Network layer security for VPNs</li>
                      <li><strong>SSH:</strong> Secure Shell for remote administration</li>
                      <li><strong>HTTPS:</strong> HTTP over TLS for web security</li>
                      <li><strong>DNSSEC:</strong> DNS Security Extensions</li>
                    </ul>
                  </div>
                  
                  <div class="protocol-card">
                    <h4>⚠️ Vulnerable Protocols (Legacy)</h4>
                    <ul>
                      <li><strong>Telnet:</strong> Unencrypted remote access</li>
                      <li><strong>FTP:</strong> File transfer without encryption</li>
                      <li><strong>HTTP:</strong> Unencrypted web traffic</li>
                      <li><strong>SNMP v1/v2:</strong> Weak authentication</li>
                      <li><strong>SMTP:</strong> Unencrypted email transmission</li>
                    </ul>
                    <p class="warning">⚠️ These should be replaced with secure alternatives</p>
                  </div>
                </div>
              </div>
              
              <div class="network-topologies">
                <h3>🏗️ Secure Network Design Principles</h3>
                <div class="design-principles">
                  <div class="principle">
                    <h4>🔗 Network Segmentation</h4>
                    <p>Divide networks into smaller, isolated segments to limit attack spread.</p>
                    <ul>
                      <li><strong>VLANs:</strong> Virtual LANs for logical separation</li>
                      <li><strong>Subnets:</strong> IP-based network division</li>
                      <li><strong>DMZ:</strong> Demilitarized zone for public services</li>
                      <li><strong>Microsegmentation:</strong> Granular access controls</li>
                    </ul>
                  </div>
                  
                  <div class="principle">
                    <h4>🎯 Least Privilege Access</h4>
                    <p>Grant minimum necessary access rights to users and systems.</p>
                    <ul>
                      <li><strong>Role-based Access:</strong> Access based on job functions</li>
                      <li><strong>Time-limited Access:</strong> Temporary permissions</li>
                      <li><strong>Location-based Access:</strong> Geographic restrictions</li>
                      <li><strong>Device-based Access:</strong> Trusted device requirements</li>
                    </ul>
                  </div>
                  
                  <div class="principle">
                    <h4>👁️ Continuous Monitoring</h4>
                    <p>Implement comprehensive visibility and threat detection.</p>
                    <ul>
                      <li><strong>SIEM:</strong> Security Information and Event Management</li>
                      <li><strong>Network Analytics:</strong> Traffic pattern analysis</li>
                      <li><strong>Threat Intelligence:</strong> Real-time threat feeds</li>
                      <li><strong>Behavioral Analysis:</strong> Anomaly detection</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="wireless-security">
                <h3>📶 Wireless Network Security</h3>
                <p>Wireless networks introduce unique security challenges:</p>
                <div class="wireless-threats">
                  <h4>⚠️ Common Wireless Threats:</h4>
                  <ul>
                    <li><strong>Evil Twin Attacks:</strong> Rogue access points</li>
                    <li><strong>WPS Attacks:</strong> WiFi Protected Setup vulnerabilities</li>
                    <li><strong>Deauthentication Attacks:</strong> Forced disconnections</li>
                    <li><strong>Packet Sniffing:</strong> Intercepting wireless traffic</li>
                    <li><strong>Man-in-the-Middle:</strong> Intercepting communications</li>
                  </ul>
                </div>
                
                <div class="wireless-security-measures">
                  <h4>🔒 Wireless Security Best Practices:</h4>
                  <ul>
                    <li><strong>WPA3 Encryption:</strong> Latest security standard</li>
                    <li><strong>Enterprise Authentication:</strong> 802.1X with RADIUS</li>
                    <li><strong>Network Isolation:</strong> Guest network separation</li>
                    <li><strong>MAC Address Filtering:</strong> Device access control</li>
                    <li><strong>Regular Security Audits:</strong> Vulnerability assessments</li>
                  </ul>
                </div>
              </div>
            </div>
          `,
          type: 'interactive',
          duration: 25
        },
        {
          id: 'firewalls-advanced',
          title: 'Advanced Firewall Technologies',
          content: `
            <div class="learning-content">
              <h2>🛡️ Advanced Firewall Technologies</h2>
              <p class="lead-text">Firewalls are the cornerstone of network security, but modern threats require advanced firewall technologies that go beyond traditional packet filtering.</p>
              
              <div class="firewall-evolution">
                <h3>📈 Firewall Technology Evolution</h3>
                <div class="evolution-timeline">
                  <div class="timeline-item">
                    <h4>1st Generation: Packet Filters (1980s)</h4>
                    <ul>
                      <li>Examine individual packets</li>
                      <li>Filter based on IP addresses and ports</li>
                      <li>No state information maintained</li>
                      <li>Limited security effectiveness</li>
                    </ul>
                  </div>
                  
                  <div class="timeline-item">
                    <h4>2nd Generation: Stateful Inspection (1990s)</h4>
                    <ul>
                      <li>Track connection states</li>
                      <li>Examine packet context</li>
                      <li>Better security than packet filters</li>
                      <li>Foundation for modern firewalls</li>
                    </ul>
                  </div>
                  
                  <div class="timeline-item">
                    <h4>3rd Generation: Application Layer (2000s)</h4>
                    <ul>
                      <li>Deep packet inspection (DPI)</li>
                      <li>Application-aware filtering</li>
                      <li>Protocol validation</li>
                      <li>Advanced threat detection</li>
                    </ul>
                  </div>
                  
                  <div class="timeline-item highlight">
                    <h4>4th Generation: Next-Generation Firewalls (2010s+)</h4>
                    <ul>
                      <li>Integrated threat intelligence</li>
                      <li>User and application identification</li>
                      <li>Advanced malware protection</li>
                      <li>Cloud integration and management</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="firewall-types">
                <h3>🔧 Modern Firewall Types</h3>
                <div class="firewall-grid">
                  <div class="firewall-type">
                    <h4>🌐 Next-Generation Firewalls (NGFW)</h4>
                    <div class="features">
                      <h5>Key Features:</h5>
                      <ul>
                        <li><strong>Application Control:</strong> Identify and control applications regardless of port</li>
                        <li><strong>User Identification:</strong> Link network activity to specific users</li>
                        <li><strong>Content Inspection:</strong> Deep packet inspection and analysis</li>
                        <li><strong>Threat Intelligence:</strong> Real-time threat feeds and signatures</li>
                        <li><strong>SSL/TLS Inspection:</strong> Decrypt and inspect encrypted traffic</li>
                      </ul>
                    </div>
                    <div class="use-cases">
                      <h5>Best For:</h5>
                      <p>Enterprise networks, comprehensive security requirements, compliance needs</p>
                    </div>
                  </div>
                  
                  <div class="firewall-type">
                    <h4>☁️ Cloud-Native Firewalls</h4>
                    <div class="features">
                      <h5>Key Features:</h5>
                      <ul>
                        <li><strong>Elastic Scaling:</strong> Automatic capacity adjustment</li>
                        <li><strong>API Integration:</strong> Programmatic management</li>
                        <li><strong>Multi-Cloud Support:</strong> Consistent policies across clouds</li>
                        <li><strong>DevOps Integration:</strong> Infrastructure as Code support</li>
                        <li><strong>Centralized Management:</strong> Cloud-based administration</li>
                      </ul>
                    </div>
                    <div class="use-cases">
                      <h5>Best For:</h5>
                      <p>Cloud environments, microservices, containerized applications</p>
                    </div>
                  </div>
                  
                  <div class="firewall-type">
                    <h4>🔄 Web Application Firewalls (WAF)</h4>
                    <div class="features">
                      <h5>Key Features:</h5>
                      <ul>
                        <li><strong>HTTP/HTTPS Protection:</strong> Web application specific filtering</li>
                        <li><strong>OWASP Top 10 Protection:</strong> Common web vulnerabilities</li>
                        <li><strong>Bot Protection:</strong> Malicious bot detection and blocking</li>
                        <li><strong>Rate Limiting:</strong> Request throttling and DDoS protection</li>
                        <li><strong>Custom Rules:</strong> Application-specific security policies</li>
                      </ul>
                    </div>
                    <div class="use-cases">
                      <h5>Best For:</h5>
                      <p>Web applications, API protection, e-commerce sites</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="firewall-deployment">
                <h3>🏗️ Firewall Deployment Strategies</h3>
                <div class="deployment-models">
                  <div class="deployment">
                    <h4>🏢 Traditional Perimeter Deployment</h4>
                    <div class="diagram-placeholder">[Network Diagram: Internet → Firewall → Internal Network]</div>
                    <ul>
                      <li><strong>Pros:</strong> Simple, cost-effective, centralized control</li>
                      <li><strong>Cons:</strong> Single point of failure, limited internal protection</li>
                      <li><strong>Use Case:</strong> Small to medium networks with limited complexity</li>
                    </ul>
                  </div>
                  
                  <div class="deployment">
                    <h4>🔄 Multi-Layer Deployment</h4>
                    <div class="diagram-placeholder">[Network Diagram: Internet → Edge FW → DMZ → Internal FW → LAN]</div>
                    <ul>
                      <li><strong>Pros:</strong> Defense in depth, better segmentation</li>
                      <li><strong>Cons:</strong> Higher complexity and cost</li>
                      <li><strong>Use Case:</strong> Large enterprises with critical assets</li>
                    </ul>
                  </div>
                  
                  <div class="deployment highlight">
                    <h4>🌐 Distributed/Zero Trust Deployment</h4>
                    <div class="diagram-placeholder">[Network Diagram: Micro-segmented network with distributed firewalls]</div>
                    <ul>
                      <li><strong>Pros:</strong> Granular control, lateral movement prevention</li>
                      <li><strong>Cons:</strong> High complexity, requires careful planning</li>
                      <li><strong>Use Case:</strong> Modern enterprises adopting zero trust</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="firewall-configuration">
                <h3>⚙️ Firewall Configuration Best Practices</h3>
                <div class="best-practices">
                  <div class="practice-category">
                    <h4>🔒 Security Policies</h4>
                    <ul>
                      <li><strong>Default Deny:</strong> Block all traffic by default, allow only necessary</li>
                      <li><strong>Least Privilege:</strong> Minimum required access for each rule</li>
                      <li><strong>Specific Rules:</strong> Avoid overly broad allow rules</li>
                      <li><strong>Regular Review:</strong> Periodic rule cleanup and optimization</li>
                      <li><strong>Documentation:</strong> Clear business justification for each rule</li>
                    </ul>
                  </div>
                  
                  <div class="practice-category">
                    <h4>📊 Monitoring & Logging</h4>
                    <ul>
                      <li><strong>Comprehensive Logging:</strong> Log all blocked and allowed traffic</li>
                      <li><strong>Log Analysis:</strong> Regular review of firewall logs</li>
                      <li><strong>SIEM Integration:</strong> Forward logs to security monitoring</li>
                      <li><strong>Alerting:</strong> Automated alerts for suspicious activity</li>
                      <li><strong>Performance Monitoring:</strong> Track firewall performance metrics</li>
                    </ul>
                  </div>
                  
                  <div class="practice-category">
                    <h4>🔄 Maintenance & Updates</h4>
                    <ul>
                      <li><strong>Firmware Updates:</strong> Regular security patches</li>
                      <li><strong>Signature Updates:</strong> Current threat intelligence</li>
                      <li><strong>Configuration Backup:</strong> Regular backup of configurations</li>
                      <li><strong>Change Management:</strong> Controlled configuration changes</li>
                      <li><strong>Testing:</strong> Validate changes in test environment</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="advanced-features">
                <h3>🚀 Advanced Firewall Features</h3>
                <div class="advanced-grid">
                  <div class="feature">
                    <h4>🔍 Deep Packet Inspection (DPI)</h4>
                    <p>Examines packet content beyond headers to identify applications, protocols, and threats.</p>
                    <ul>
                      <li>Application identification</li>
                      <li>Content filtering</li>
                      <li>Malware detection</li>
                      <li>Data loss prevention</li>
                    </ul>
                  </div>
                  
                  <div class="feature">
                    <h4>🤖 Machine Learning Integration</h4>
                    <p>Uses AI/ML for advanced threat detection and automated response.</p>
                    <ul>
                      <li>Behavioral analysis</li>
                      <li>Anomaly detection</li>
                      <li>Predictive security</li>
                      <li>Automated rule optimization</li>
                    </ul>
                  </div>
                  
                  <div class="feature">
                    <h4>🔗 API Integration</h4>
                    <p>Programmatic management and integration with security orchestration.</p>
                    <ul>
                      <li>Automated provisioning</li>
                      <li>Policy synchronization</li>
                      <li>Threat intelligence feeds</li>
                      <li>SOAR integration</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="practical-scenario">
                <h3>🎓 Practical Configuration Scenario</h3>
                <div class="scenario-box">
                  <h4>🏢 Enterprise Firewall Implementation</h4>
                  <p><strong>Scenario:</strong> Configure firewall for a mid-size company with 500 employees</p>
                  
                  <div class="requirements">
                    <h5>Requirements:</h5>
                    <ul>
                      <li>Secure internet access for employees</li>
                      <li>Protected DMZ for web and email servers</li>
                      <li>Remote access for employees</li>
                      <li>Guest network isolation</li>
                      <li>Compliance with industry regulations</li>
                    </ul>
                  </div>
                  
                  <div class="solution">
                    <h5>Recommended Configuration:</h5>
                    <ol>
                      <li><strong>Zone Configuration:</strong>
                        <ul>
                          <li>Internet zone (untrusted)</li>
                          <li>DMZ zone (limited trust)</li>
                          <li>LAN zone (trusted)</li>
                          <li>Guest zone (restricted)</li>
                        </ul>
                      </li>
                      <li><strong>Security Policies:</strong>
                        <ul>
                          <li>LAN to Internet: Allow HTTP/HTTPS, block P2P</li>
                          <li>Internet to DMZ: Allow specific ports to servers</li>
                          <li>DMZ to LAN: Deny all</li>
                          <li>Guest to Internet: Allow HTTP/HTTPS only</li>
                        </ul>
                      </li>
                      <li><strong>Advanced Features:</strong>
                        <ul>
                          <li>Application control for productivity</li>
                          <li>URL filtering for malicious sites</li>
                          <li>IPS for threat prevention</li>
                          <li>VPN for remote access</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          `,
          type: 'interactive',
          duration: 30
        }
      ],
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What security model follows the principle "never trust, always verify"?',
            options: ['Defense in Depth', 'Zero Trust', 'Perimeter Security', 'Network Segmentation'],
            correctAnswer: 1,
            explanation: 'Zero Trust model follows the principle of never trusting and always verifying, regardless of location within or outside the network perimeter.'
          },
          {
            id: 'q2',
            question: 'Which type of firewall examines packet content beyond headers?',
            options: ['Packet-Filtering', 'Stateful Inspection', 'Next-Generation Firewall', 'Circuit-Level Gateway'],
            correctAnswer: 2,
            explanation: 'Next-Generation Firewalls (NGFW) use Deep Packet Inspection (DPI) to examine packet content beyond just headers, enabling application and content awareness.'
          },
          {
            id: 'q3',
            question: 'What is the primary security benefit of network segmentation?',
            options: ['Improved performance', 'Cost reduction', 'Limiting attack spread', 'Easier management'],
            correctAnswer: 2,
            explanation: 'Network segmentation limits the spread of attacks by containing threats within isolated network segments, preventing lateral movement.'
          },
          {
            id: 'q4',
            question: 'Which wireless security standard provides the strongest encryption?',
            options: ['WEP', 'WPA', 'WPA2', 'WPA3'],
            correctAnswer: 3,
            explanation: 'WPA3 is the latest and most secure wireless security standard, providing stronger encryption and protection against various attack methods.'
          },
          {
            id: 'q5',
            question: 'What does DPI stand for in firewall technology?',
            options: ['Data Processing Interface', 'Deep Packet Inspection', 'Dynamic Protocol Identification', 'Distributed Processing Intelligence'],
            correctAnswer: 1,
            explanation: 'Deep Packet Inspection (DPI) is a technology that examines packet content beyond just headers to identify applications, protocols, and potential threats.'
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
      try {
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
        } else {
          console.error(`Module content not found for moduleId: ${moduleId}`)
          toast.error('Module content not found')
        }
      } catch (error) {
        console.error('Failed to load module:', error)
        toast.error('Failed to load module content')
      } finally {
        setLoading(false)
      }
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
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center relative overflow-hidden">
        {/* Cyber grid background */}
        <div className="cyber-grid absolute inset-0 opacity-20"></div>
        
        {/* Floating spark elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full spark-float-${(i % 3) + 1}`}
            style={{
              background: `var(--spark-${['electric', 'neon', 'plasma', 'energy'][i % 4]})`,
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`,
              boxShadow: `0 0 10px var(--spark-${['electric', 'neon', 'plasma', 'energy'][i % 4]})`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 1 }}
          />
        ))}

        <div className="text-center relative z-10">
          <SparkLoader 
            size="xl" 
            variant="neural" 
            text="Loading advanced cybersecurity content..."
          />
          
          <motion.div
            className="mt-8 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold gradient-text">
              AstraForensics Learning Platform
            </h2>
            <p className="text-muted-foreground">
              Preparing your personalized learning experience...
            </p>
            
            {/* Progress indicator */}
            <motion.div
              className="flex justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'var(--spark-electric)' }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
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

  // Safety check for current page
  if (!currentPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <div className="text-destructive">
              <Target size={48} className="mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold">Page Not Found</h3>
            <p className="text-muted-foreground">The requested page could not be loaded.</p>
            <Button onClick={onBack}>Return to Modules</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="cyber-grid absolute inset-0 opacity-5"></div>
        
        {/* Floating Learning Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-orb absolute w-3 h-3"
            style={{
              background: `var(--spark-${['electric', 'neon', 'plasma', 'aurora'][i % 4]})`,
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`,
              filter: 'blur(0.5px)'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 1 }}
          />
        ))}
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/80"></div>
      </div>

      {/* Enhanced Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-card/70 backdrop-blur-xl sticky top-0 z-20 relative"
        style={{ boxShadow: 'var(--shadow-premium)' }}
      >
        {/* Aurora effect */}
        <div className="absolute inset-0 aurora-shimmer opacity-15"></div>
        
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center space-x-2 premium-button-hover bg-gradient-to-r from-card to-secondary/50 border-primary/20"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </Button>
              </motion.div>
              
              <div className="flex items-center space-x-3 premium-text-reveal">
                <motion.div
                  className="premium-spark-glow p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <BookOpen size={20} className="text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    {moduleContent.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Page {currentPageIndex + 1} of {moduleContent.pages.length} • Interactive Learning
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Right Side - Progress & Navigation */}
            <div className="flex items-center space-x-4">
              <motion.div
                className="hidden sm:flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="outline" className="flex items-center space-x-1 bg-gradient-to-r from-card to-secondary/50">
                  <Clock size={12} />
                  <span>{currentPage?.duration || 0} min</span>
                </Badge>
                
                <div className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {getProgressPercentage()}% Complete
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <motion.div 
            className="mt-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <Progress value={getProgressPercentage()} className="h-3 premium-progress" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-full rounded-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Content Area */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPageIndex}
              initial={{ opacity: 0, y: 30, rotateX: -5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -30, rotateX: 5 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
            >
              <Card className="relative overflow-hidden border-0 backdrop-blur-sm bg-gradient-to-br from-card to-card/80" style={{ boxShadow: 'var(--shadow-premium)' }}>
                {/* Premium Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"></div>
                
                {/* Aurora effect for interactive content */}
                {currentPage.type === 'interactive' && (
                  <div className="absolute inset-0 aurora-shimmer opacity-10"></div>
                )}
                
                {/* Content Type Indicator */}
                <motion.div
                  className="absolute top-4 right-4 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Badge 
                    variant="outline" 
                    className={`
                      premium-spark-glow flex items-center space-x-1 font-medium
                      ${currentPage.type === 'interactive' ? 'bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/30' : 
                        currentPage.type === 'video' ? 'bg-gradient-to-r from-info/10 to-primary/10 text-info border-info/30' : 
                        'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30'}
                    `}
                  >
                    {currentPage.type === 'interactive' && <Brain size={12} />}
                    {currentPage.type === 'video' && <PlayCircle size={12} />}
                    {currentPage.type === 'text' && <BookOpen size={12} />}
                    <span className="capitalize">{currentPage.type}</span>
                  </Badge>
                </motion.div>
                
                <CardHeader className="relative z-10 p-6 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between"
                  >
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                      {currentPage.title}
                    </CardTitle>
                  </motion.div>
                </CardHeader>

                <CardContent className="relative z-10 p-6 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="prose prose-lg max-w-none learning-content"
                    dangerouslySetInnerHTML={{ __html: currentPage.content }}
                  />
                  
                  {/* Reading progress indicator */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Reading time: ~{currentPage?.duration || 0} minutes</span>
                      <motion.div
                        className="flex items-center space-x-1"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle size={14} className="text-success" />
                        <span>Page completed</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Navigation */}
          <motion.div 
            className="flex justify-between items-center mt-8 p-4 rounded-xl bg-gradient-to-r from-card to-secondary/20 backdrop-blur-sm"
            style={{ boxShadow: 'var(--shadow-md)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handlePreviousPage}
                disabled={currentPageIndex === 0}
                variant="outline"
                className="flex items-center space-x-2 premium-button-hover bg-gradient-to-r from-card to-secondary/50"
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </Button>
            </motion.div>

            {/* Enhanced Page Indicators */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground font-medium">
                {currentPageIndex + 1} of {moduleContent.pages.length}
              </span>
              <div className="flex space-x-2">
                {moduleContent.pages.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`
                      w-3 h-3 rounded-full cursor-pointer
                      ${index <= currentPageIndex ? 
                        'bg-gradient-to-r from-primary to-accent' : 
                        'bg-muted/50'
                      }
                    `}
                    animate={{
                      scale: index === currentPageIndex ? [1, 1.3, 1] : 1,
                      boxShadow: index === currentPageIndex ? [
                        '0 0 0px var(--primary)',
                        '0 0 8px var(--primary)',
                        '0 0 4px var(--primary)'
                      ] : '0 0 0px transparent'
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    onClick={() => setCurrentPageIndex(index)}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleNextPage}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 premium-button-hover"
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}