import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SheetyService } from '../../services/sheety.service';
import { firstValueFrom } from 'rxjs';

interface Question {
  id: number;
  type: 'selection' | 'text' | 'name' | 'dob';
  question: string;
  options?: string[];
  placeholder?: string;
}

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.css']
})
export class ProfileSetupComponent implements OnInit {
  photoUploading: boolean[] = [false, false, false];
  uploadProgress: number[] = [0, 0, 0];

  // Add to your component class
isSubmitting = false;
loadingMessages = [
  "Creating your profile...",
  "Finding someone special for you...",
  "Almost there...",
  "Getting everything ready..."
];
currentLoadingMessage = this.loadingMessages[0];


  showDatePicker = false;
  showPhotoUpload = false;
  photos: (string | null)[] = [null, null, null];
  photoError = '';
  userEmail: string = '';
  userInfo: { name: string; email: string  } | null = null;
  currentQuestion = 0;
  answers: Record<string, string | string[]> = {};
  validationErrors: Record<string, string> = {};

  questions: Question[] = [
    {
      id: 0,
      type: 'name',
      question: 'What is your name?',
      placeholder: 'Enter your full name'
    },
    {
      id: 1,
      type: 'dob',
      question: 'What is your birth date?',
      placeholder: 'Select your date of birth'
    },
    {
      id: 2,
      type: 'selection',
      question: 'What is your gender identity?',
      options: ['Male','Female']
    },
    {
      id: 3,
      type: 'selection',
      question: 'Whom are you interested in?',
      options: ['Men','Women']
    },

    {
      id: 4,
      type: 'selection',
      question: 'What are your interests?',
      options: ['Football', 'Nature', 'Language', 'Photography', 'Music', 'Writing', 'Travel', 'Cooking']
    },
    {
      id: 5,
      type: 'selection',
      question: 'Do you smoke?',
      options: ['Never', 'Occasionally', 'Regularly', 'Trying to quit']
    },
    {
      id: 6,
      type: 'selection',
      question: 'Do you drink alcohol?',
      options: ['Never', 'Socially', 'Regularly', 'Occasionally']
    },
    {
      id: 7,
      type: 'selection',
      question: "What's your relationship goal?",
      options: ['Serious relationship', 'Casual dating', 'Marriage', 'Just friends', 'Not sure yet']
    },
    {
      id: 8,
      type: 'selection',
      question: "What's your education level?",
      options: ["High School", "Bachelor's", "Master's", 'PhD', 'Trade School', 'Other']
    },
    {
      id: 9,
      type: 'selection',
      question: "What's your workout frequency?",
      options: ['Daily', 'Few times a week', 'Weekly', 'Monthly', 'Rarely', 'Never']
    },
    {
      id: 10,
      type: 'selection',
      question: "What's your ideal weekend?",
      options: ['Outdoors', 'Netflix & chill', 'Social gatherings', 'Exploring places', 'Reading', 'Working out']
    },
    {
      id: 11,
      type: 'selection',
      question: "What is your religion?",
      options: ['Hindu','Muslim','Christian','Sikh','Jain','Buddhist','Parsi','Jewish']
    },
    {
      id: 12,
      type: 'selection',
      question: "What is your Zodiac Sign?",
      options: ['Aries', 'Taurus', 'Gemini', 'Cancer','Leo', 'Virgo', 'Libra', 'Scorpio','Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    },
    {
      id: 13,
      type: 'selection',
      question: "Which languages do you speak?",
      options: ['Hindi', 'English', 'Marathi', 'Gujarati', 'Punjabi','Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam','Urdu', 'Odia', 'Assamese']
    },
    {
      id: 14,
      type: 'text',
      question: 'Where would you like to go for a first date?',
      placeholder: 'Describe your ideal first date location...'
    },
    {
      id: 15,
      type: 'text',
      question: "What's something unique about you?",
      placeholder: 'Tell us what makes you special...'
    },
    {
      id: 16,
      type: 'text',
      question: 'What are you looking for in a partner?',
      placeholder: 'Describe your ideal partner...'
    }
  ];

  constructor(private auth: AuthService, private router: Router,private sheety: SheetyService) {}



  // In profile-setup.component.ts
async ngOnInit() {
  const { data } = await this.auth.getUser();
  this.userEmail = data?.user?.email || '';  // Make sure to set this.userEmail
  console.log('Current user email:', this.userEmail);
  
  if (!this.userEmail) {
    this.router.navigate(['/']);
    return;
  }

  const exists = await this.sheety.checkProfileExists(this.userEmail);
  console.log('Profile exists:', exists);
  
  if (exists) {
    console.log('Redirecting to /home');
    this.router.navigate(['/home']);
  }
}



  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  

  getOptionIconClass(option: string): string {
    const iconClassMap: Record<string, string> = {
      Football: 'fa-solid fa-futbol',
      Nature: 'fa-solid fa-leaf',
      Language: 'fa-solid fa-language',
      Photography: 'fa-solid fa-camera',
      Music: 'fa-solid fa-music',
      Writing: 'fa-solid fa-pen-nib',
      Travel: 'fa-solid fa-plane',
      Cooking: 'fa-solid fa-utensils',
      Never: 'fa-solid fa-ban',
      Occasionally: 'fa-solid fa-redo',
      Regularly: 'fa-solid fa-check-circle',
      Socially: 'fa-solid fa-beer',
      'Trying to quit': 'fa-solid fa-hand',
      'Serious relationship': 'fa-solid fa-heart',
      'Casual dating': 'fa-solid fa-smile',
      Marriage: 'fa-solid fa-ring',
      'Just friends': 'fa-solid fa-user-friends',
      'Not sure yet': 'fa-solid fa-question',
      'High School': 'fa-solid fa-school',
      "Bachelor's": 'fa-solid fa-graduation-cap',
      "Master's": 'fa-solid fa-graduation-cap',
      PhD: 'fa-solid fa-user-graduate',
      'Trade School': 'fa-solid fa-tools',
      Other: 'fa-solid fa-book',
      Daily: 'fa-solid fa-dumbbell',
      'Few times a week': 'fa-solid fa-running',
      Weekly: 'fa-solid fa-walking',
      Monthly: 'fa-solid fa-calendar-alt',
      Rarely: 'fa-solid fa-bed',
      Outdoors: 'fa-solid fa-hiking',
      'Netflix & chill': 'fa-solid fa-tv',
      'Social gatherings': 'fa-solid fa-glass-cheers',
      'Exploring places': 'fa-solid fa-map-marked-alt',
      'Reading': 'fa-solid fa-book-reader',
      'Working out': 'fa-solid fa-weight-hanging',
      'Hindu': 'fa-solid fa-om',
      'Muslim': 'fa-solid fa-moon',
      'Christian': 'fa-solid fa-cross',
      'Sikh': 'fa-solid fa-torii-gate', // alternative to fa-gopuram (Pro)
      'Jain': 'fa-solid fa-bahai',      // fallback, not ideal
      'Buddhist': 'fa-solid fa-peace',
      'Parsi': 'fa-solid fa-fire',
      'Jewish': 'fa-solid fa-star-of-david',

      'Male': 'fa-solid fa-mars',
      'Female': 'fa-solid fa-venus',
      'Men': 'fa-solid fa-mars',
      'Women': 'fa-solid fa-venus',
      


  
    };
    return iconClassMap[option] || '';
  }

  isLimitedMultiSelect(question: Question): boolean {
    return question.question.toLowerCase().includes('interests') ||
           question.question.toLowerCase().includes('ideal weekend')||
           question.question.toLowerCase().includes('languages do you speak');
  }

  handleSelectionAnswer(questionId: number, option: string) {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return;

    const isLimited = this.isLimitedMultiSelect(question);
    const currentAnswers = (this.answers[questionId.toString()] as string[]) || [];
    const isSelected = currentAnswers.includes(option);

    if (isLimited) {
      const updatedAnswers = isSelected
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];

      if (updatedAnswers.length > 4) {
        this.validationErrors[questionId.toString()] = 'You can select up to 4 options only.';
        return;
      } else if (updatedAnswers.length === 0) {
        this.validationErrors[questionId.toString()] = 'Please select at least 1 option.';
      } else {
        delete this.validationErrors[questionId.toString()];
      }

      this.answers[questionId.toString()] = updatedAnswers;
    } else {
      this.answers[questionId.toString()] = [option];
      delete this.validationErrors[questionId.toString()];
    }
  }

  handleTextAnswer(questionId: number, value: string) {
    this.answers[questionId.toString()] = value;
    if (!value.trim()) {
      this.validationErrors[questionId.toString()] = 'This field is required.';
    } else {
      delete this.validationErrors[questionId.toString()];
    }
  }

  validateQuestion(question: Question): boolean {
    const answer = this.answers[question.id.toString()];

    if (question.type === 'text' || question.type === 'name') {
      if (!answer || !(answer as string).trim()) {
        this.validationErrors[question.id.toString()] = 'This field is required.';
        return false;
      }

      // Add word count validation for specific text questions
    if ([9, 10, 11].includes(question.id)) {
  const text = (answer as string).trim();

  // 1. Minimum and maximum character length
  if (text.length < 5 || text.length > 200) {
    this.validationErrors[question.id.toString()] = 'Answer must be between 5 and 200 characters.';
    return false;
  }

  // 2. Must contain at least 3 words
  const words = text.split(/\s+/);
  if (words.length < 3) {
    this.validationErrors[question.id.toString()] = 'Please write a bit more — at least 3 words.';
    return false;
  }

  // 3. Must contain letters and spaces (not just symbols or one repeated character)
  if (!/[a-zA-Z]/.test(text) || !/[a-zA-Z]{3,}/.test(text)) {
    this.validationErrors[question.id.toString()] = 'Please enter a valid sentence using real words.';
    return false;
  }

  // 4. Reject inputs with excessive repetition (e.g. same char repeated)
  const repeatedChar = /([a-zA-Z])\1{5,}/;
  if (repeatedChar.test(text)) {
    this.validationErrors[question.id.toString()] = 'Avoid spamming or repeating the same character.';
    return false;
  }
}



    } else if (question.type === 'dob') {
      if (!answer) {
        this.validationErrors[question.id.toString()] = 'Please enter your date of birth.';
        return false;
      }
      
      const dobDate = new Date(answer as string);
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      
      if (dobDate > minAgeDate) {
        this.validationErrors[question.id.toString()] = 'You must be at least 18 years old.';
        return false;
      }
    } else if (question.type === 'selection') {
      const selected = (answer as string[]) || [];

      if (this.isLimitedMultiSelect(question)) {
        if (selected.length === 0) {
          this.validationErrors[question.id.toString()] = 'Please select at least 1 option.';
          return false;
        }
        if (selected.length > 4) {
          this.validationErrors[question.id.toString()] = 'You can select up to 4 options only.';
          return false;
        }
      } else {
        if (selected.length !== 1) {
          this.validationErrors[question.id.toString()] = 'Please select one option.';
          return false;
        }
      }
    }

    delete this.validationErrors[question.id.toString()];
    return true;
  }

  nextQuestion() {
    const currentQ = this.questions[this.currentQuestion];
    if (!this.validateQuestion(currentQ)) return;

    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  handleSubmit() {
    let allValid = true;
    this.questions.forEach(q => {
      if (!this.validateQuestion(q)) {
        allValid = false;
      }
    });

    if (!allValid) {
      const firstErrorIndex = this.questions.findIndex(q => this.validationErrors[q.id.toString()]);
      if (firstErrorIndex !== -1) {
        this.currentQuestion = firstErrorIndex;
      }
      return;
    }

    this.showPhotoUpload = true;
  }

async handleFileInput(event: any, index: number) {
  const file = event.target.files[0];
  if (!file) return;

  // Clear previous errors
  this.validationErrors['photo'] = '';
  this.uploadProgress[index] = 0;

  // Validate file
  if (file.size > 5 * 1024 * 1024) {
    this.validationErrors['photo'] = 'File must be <5MB';
    return;
  }
  if (!file.type.startsWith('image/')) {
    this.validationErrors['photo'] = 'Only images allowed';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');

  this.photoUploading[index] = true;

  try {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        this.uploadProgress[index] = Math.round((e.loaded / e.total) * 100);
      }
    });

    const response = await new Promise<any>((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dtucu0whj/image/upload', true);
      xhr.send(formData);
    });

    if (!response.secure_url) throw new Error('No URL returned');
    this.photos[index] = response.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    this.validationErrors['photo'] = 'Upload failed. Try another image.';
    event.target.value = '';
  } finally {
    this.photoUploading[index] = false;
    this.uploadProgress[index] = 0;
  }
}

// Keep your existing removePhoto and areThreePhotosUploaded methods
removePhoto(index: number) {
  this.photos[index] = null;
}

areThreePhotosUploaded(): boolean {
  return this.photos.filter(p => p !== null).length === 3;
}

// Remove the duplicate method and keep this one:
async completeProfile() {
  if (this.isSubmitting) return; // Prevent multiple clicks
  
  this.isSubmitting = true;
  
  // Start rotating messages
  const messageInterval = setInterval(() => {
    const currentIndex = this.loadingMessages.indexOf(this.currentLoadingMessage);
    const nextIndex = (currentIndex + 1) % this.loadingMessages.length;
    this.currentLoadingMessage = this.loadingMessages[nextIndex];
  }, 3000);

  const dob = new Date(this.answers['1'] as string);
  const age = this.calculateAge(dob);

  const profileData = {
    name: this.answers['0'],
    email: this.userEmail || '',
    dob: dob.toISOString().split('T')[0],
    age,
    gender: this.getSingleAnswer('2'),
    interestedIn: this.getSingleAnswer('3'),
    interests: this.getMultiAnswer('4'),
    smokes: this.getSingleAnswer('5'),
    drinks: this.getSingleAnswer('6'),
    relationshipGoal: this.getSingleAnswer('7'),
    education: this.getSingleAnswer('8'),
    workout: this.getSingleAnswer('9'),
    weekend: this.getMultiAnswer('10'),
    religion: this.getSingleAnswer('11'),
    zodicSign: this.getSingleAnswer('12'),
    languages: this.getMultiAnswer('13'),
    firstDate: this.answers['14'] || '',
    unique: this.answers['15'] || '',
    idealPartner: this.answers['16'] || '',
    photos: (this.photos.filter(p => !!p) || []).join(', ')
  };

  console.log('Sending to Sheety:', profileData);

  try {
    const res = await firstValueFrom(this.sheety.postUserData(profileData));
    console.log('Data sent to Sheety:', res);
    this.router.navigate(['/home']);
  } catch (err) {
    console.error('Error sending data to Sheety:', err);
    // Optionally show error message to user
  } finally {
    clearInterval(messageInterval);
    this.isSubmitting = false;
  }
}



getSingleAnswer(key: string): string {
  const ans = this.answers[key];
  return Array.isArray(ans) ? ans[0] : ans || '';
}

getMultiAnswer(key: string): string {
  const ans = this.answers[key];
  return Array.isArray(ans) ? ans.join(', ') : ans || '';
}


calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}


  get progress(): number {
    if (this.showPhotoUpload) return 100;
    return ((this.currentQuestion + 1) / (this.questions.length + 1)) * 100;
  }
}