/**
 * Offline Service Manager
 * 
 * Provides fallback functionality when backend services are unavailable
 */

export interface OfflineQuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  points: number
  tags: string[]
}

export interface OfflineLearningContent {
  moduleId: string
  title: string
  sections: Array<{
    id: string
    title: string
    content: string
    duration: number
  }>
  totalDuration: string
}

class OfflineService {
  private static instance: OfflineService

  static getInstance(): OfflineService {
    if (!this.instance) {
      this.instance = new OfflineService()
    }
    return this.instance
  }

  // Offline quiz questions database
  private offlineQuestions: OfflineQuizQuestion[] = [
    {
      id: 'offline-q1',
      question: 'What are the three pillars of the CIA triad in cybersecurity?',
      options: [
        'Confidentiality, Integrity, Availability',
        'Control, Investigation, Analysis',
        'Compliance, Infrastructure, Authentication',
        'Cryptography, Identity, Authorization'
      ],
      correctAnswer: 0,
      explanation: 'The CIA triad consists of Confidentiality (protecting information from unauthorized access), Integrity (ensuring data accuracy and trustworthiness), and Availability (ensuring information is accessible when needed). These are the foundational principles of information security.',
      difficulty: 'medium',
      topic: 'fundamentals',
      points: 10,
      tags: ['cia-triad', 'basics', 'fundamentals']
    },
    {
      id: 'offline-q2',
      question: 'Which of the following is NOT a type of malware?',
      options: [
        'Virus',
        'Trojan Horse',
        'Firewall',
        'Ransomware'
      ],
      correctAnswer: 2,
      explanation: 'A firewall is a security system that monitors and controls network traffic based on predetermined security rules. It is a protective measure, not malware. Viruses, Trojan Horses, and Ransomware are all types of malicious software designed to harm or gain unauthorized access to systems.',
      difficulty: 'easy',
      topic: 'malware',
      points: 5,
      tags: ['malware', 'security-tools', 'basics']
    },
    {
      id: 'offline-q3',
      question: 'What is the primary purpose of encryption in cybersecurity?',
      options: [
        'To compress data for faster transmission',
        'To protect data confidentiality by making it unreadable',
        'To detect malware in files',
        'To speed up network connections'
      ],
      correctAnswer: 1,
      explanation: 'Encryption transforms readable data (plaintext) into an encoded format (ciphertext) that can only be decoded by authorized parties with the correct decryption key. This protects data confidentiality and ensures that even if data is intercepted, it cannot be read without proper authorization.',
      difficulty: 'medium',
      topic: 'cryptography',
      points: 10,
      tags: ['encryption', 'cryptography', 'data-protection']
    },
    {
      id: 'offline-q4',
      question: 'In multi-factor authentication, what does "something you know" refer to?',
      options: [
        'Fingerprint scan',
        'Password or PIN',
        'Security token',
        'Voice recognition'
      ],
      correctAnswer: 1,
      explanation: 'Multi-factor authentication uses three categories of factors: "something you know" (knowledge factors like passwords, PINs, security questions), "something you have" (possession factors like tokens, cards), and "something you are" (inherence factors like biometrics such as fingerprints or voice recognition).',
      difficulty: 'medium',
      topic: 'authentication',
      points: 10,
      tags: ['mfa', 'authentication', 'identity', 'access-control']
    },
    {
      id: 'offline-q5',
      question: 'What is a key difference between HTTP and HTTPS?',
      options: [
        'HTTPS is faster than HTTP',
        'HTTPS uses encryption while HTTP does not',
        'HTTP works on mobile devices, HTTPS does not',
        'There is no difference'
      ],
      correctAnswer: 1,
      explanation: 'HTTPS (HTTP Secure) uses SSL/TLS encryption to secure communication between a web browser and server, protecting data from eavesdropping and tampering. HTTP transmits data in plain text, making it vulnerable to interception. The "S" in HTTPS stands for "Secure".',
      difficulty: 'easy',
      topic: 'web-security',
      points: 5,
      tags: ['https', 'ssl', 'tls', 'web-security', 'encryption']
    },
    {
      id: 'offline-q6',
      question: 'What is social engineering in the context of cybersecurity?',
      options: [
        'Designing secure network architectures',
        'Manipulating people to divulge confidential information',
        'Programming automated security systems',
        'Analyzing network traffic patterns'
      ],
      correctAnswer: 1,
      explanation: 'Social engineering is the psychological manipulation of people to perform actions or divulge confidential information. It exploits human psychology rather than technical vulnerabilities, making it one of the most dangerous attack vectors. Examples include phishing emails, pretexting, and baiting.',
      difficulty: 'medium',
      topic: 'social-engineering',
      points: 10,
      tags: ['social-engineering', 'phishing', 'human-factor', 'psychology']
    },
    {
      id: 'offline-q7',
      question: 'What is the main purpose of a penetration test?',
      options: [
        'To steal sensitive information',
        'To find and exploit vulnerabilities in a controlled environment',
        'To install malware on systems',
        'To slow down network performance'
      ],
      correctAnswer: 1,
      explanation: 'Penetration testing (pen testing) is an authorized simulated cyber attack on a computer system, performed to evaluate security. Ethical hackers attempt to find and exploit vulnerabilities in a controlled, legal environment to help organizations improve their security posture before malicious attackers can exploit these weaknesses.',
      difficulty: 'hard',
      topic: 'penetration-testing',
      points: 15,
      tags: ['pen-testing', 'ethical-hacking', 'vulnerability-assessment', 'security-testing']
    },
    {
      id: 'offline-q8',
      question: 'What is a zero-day vulnerability?',
      options: [
        'A vulnerability that takes zero days to patch',
        'A vulnerability that is unknown to security vendors and has no available patch',
        'A vulnerability that causes zero damage',
        'A vulnerability that is exactly one day old'
      ],
      correctAnswer: 1,
      explanation: 'A zero-day vulnerability is a security flaw that is unknown to security vendors and system administrators, meaning there is no patch or fix available. The term "zero-day" refers to the number of days developers have had to create and distribute a fix for the vulnerability - which is zero.',
      difficulty: 'hard',
      topic: 'vulnerabilities',
      points: 15,
      tags: ['zero-day', 'vulnerabilities', 'exploits', 'advanced-threats']
    }
  ]

  // AI response templates for offline mode
  private offlineAIResponses: Record<string, string> = {
    greeting: "Hello! I'm currently operating in offline mode, but I can still help you with basic cybersecurity concepts and practice questions. What would you like to learn about?",
    
    'cia-triad': "The CIA triad is the foundation of cybersecurity, consisting of:\n\n🔒 **Confidentiality** - Protecting information from unauthorized access\n🛡️ **Integrity** - Ensuring data accuracy and preventing unauthorized changes\n⚡ **Availability** - Making sure information is accessible when needed\n\nThese three principles guide all cybersecurity decisions and implementations.",
    
    'malware': "Malware (malicious software) includes:\n\n🦠 **Viruses** - Self-replicating programs that spread to other files\n🐴 **Trojans** - Disguised malware that appears legitimate\n🔒 **Ransomware** - Encrypts files and demands payment\n🪱 **Worms** - Self-propagating malware that spreads across networks\n🕵️ **Spyware** - Secretly monitors and collects information",
    
    'social-engineering': "Social engineering exploits human psychology rather than technical vulnerabilities:\n\n📧 **Phishing** - Fraudulent emails requesting sensitive information\n📞 **Pretexting** - Creating fake scenarios to obtain information\n🎣 **Baiting** - Offering something enticing to trigger actions\n👥 **Tailgating** - Following authorized personnel into secure areas",
    
    'default': "I'm currently in offline mode, so my responses are limited. However, I can help you with:\n\n• Basic cybersecurity concepts\n• Practice quiz questions\n• Fundamental security principles\n\nWhat specific topic would you like to explore?"
  }

  // Generate offline quiz
  generateOfflineQuiz(topic: string, difficulty: string, questionCount: number): OfflineQuizQuestion[] {
    let filteredQuestions = this.offlineQuestions

    // Filter by topic if specified
    if (topic && topic !== 'general') {
      filteredQuestions = this.offlineQuestions.filter(q => 
        q.topic.includes(topic.toLowerCase()) || 
        q.tags.some(tag => tag.includes(topic.toLowerCase()))
      )
    }

    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'mixed') {
      const difficultyFiltered = filteredQuestions.filter(q => q.difficulty === difficulty)
      if (difficultyFiltered.length > 0) {
        filteredQuestions = difficultyFiltered
      }
    }

    // Shuffle and return requested number of questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, questionCount)
  }

  // Generate offline AI response
  generateOfflineAIResponse(userMessage: string): string {
    const message = userMessage.toLowerCase()

    // Check for specific topics
    if (message.includes('cia') || message.includes('confidentiality') || message.includes('integrity') || message.includes('availability')) {
      return this.offlineAIResponses['cia-triad']
    }

    if (message.includes('malware') || message.includes('virus') || message.includes('trojan') || message.includes('ransomware')) {
      return this.offlineAIResponses['malware']
    }

    if (message.includes('social engineering') || message.includes('phishing') || message.includes('pretexting')) {
      return this.offlineAIResponses['social-engineering']
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return this.offlineAIResponses['greeting']
    }

    // Default response
    return this.offlineAIResponses['default']
  }

  // Check if running in offline mode
  isOfflineMode(): boolean {
    return !navigator.onLine || typeof window === 'undefined' || !window.spark
  }

  // Get offline study tips
  getOfflineStudyTips(): string[] {
    return [
      "Practice the CIA triad concepts daily - they're fundamental to all cybersecurity work",
      "Learn to identify common malware types and their characteristics",
      "Understand social engineering tactics to better protect yourself and others",
      "Study network security basics including firewalls and intrusion detection",
      "Practice with offline quiz questions to reinforce your knowledge",
      "Read cybersecurity news and case studies to stay current with threats",
      "Set up a virtual lab environment to practice hands-on skills",
      "Join cybersecurity communities and forums for continuous learning"
    ]
  }

  // Get career guidance for offline mode
  getOfflineCareerGuidance(): string {
    return `
# Cybersecurity Career Paths (Offline Guide)

## Popular Career Paths:

### 1. Security Analyst
- **Role**: Monitor security events, investigate incidents
- **Skills**: SIEM tools, incident response, threat analysis
- **Entry Level**: Yes
- **Salary Range**: $50,000 - $90,000

### 2. Penetration Tester
- **Role**: Ethical hacking, vulnerability assessment
- **Skills**: Kali Linux, Metasploit, networking, programming
- **Entry Level**: With training/certification
- **Salary Range**: $70,000 - $120,000

### 3. Security Engineer
- **Role**: Design and implement security solutions
- **Skills**: Security architecture, cloud security, automation
- **Entry Level**: With experience
- **Salary Range**: $80,000 - $140,000

### 4. Security Consultant
- **Role**: Provide security advice to organizations
- **Skills**: Risk assessment, compliance, communication
- **Entry Level**: With expertise
- **Salary Range**: $90,000 - $150,000+

## Recommended Certifications:
- CompTIA Security+
- CEH (Certified Ethical Hacker)
- CISSP (Certified Information Systems Security Professional)
- CISM (Certified Information Security Manager)

## Next Steps:
1. Complete foundational courses
2. Gain hands-on experience with labs
3. Pursue relevant certifications
4. Build a portfolio of projects
5. Network with cybersecurity professionals
    `
  }
}

export const offlineService = OfflineService.getInstance()