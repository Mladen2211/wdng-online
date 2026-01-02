import { Locale } from './config';

const translations = {
  en: {
    // Landing Page
    landing: {
      hero: {
        title: 'Create Your Dream Wedding Website',
        subtitle: 'Beautiful, personalized wedding websites in minutes. Share your love story with the world.',
        cta: 'Start Building',
        secondaryCta: 'View Examples'
      },
      features: {
        title: 'Everything You Need',
        subtitle: 'Create a stunning wedding website with powerful features',
        themes: {
          title: 'Beautiful Themes',
          description: 'Choose from elegant, professionally designed themes'
        },
        rsvp: {
          title: 'RSVP Management',
          description: 'Collect and manage guest responses easily'
        },
        photos: {
          title: 'Photo Sharing',
          description: 'Let guests upload and share wedding photos'
        },
        mobile: {
          title: 'Mobile Friendly',
          description: 'Perfect experience on any device'
        },
        subdomain: {
          title: 'Personal Subdomain',
          description: 'Get a beautiful, custom URL like ana&luka.wdng.online included with your site.'
        },
        editor: {
          title: 'Real-time Editor',
          description: 'See your changes as you type. Our split-screen builder makes designing intuitive and fast.'
        }
      },
      howItWorks: {
        title: 'Build in 3 simple steps.',
        step1: {
          title: 'Choose your vibe',
          desc: 'Select a layout and theme that matches your wedding style.'
        },
        step2: {
          title: 'Add your details',
          desc: 'Fill in the date, location, and your story. Add events to the timeline.'
        },
        step3: {
          title: 'Publish & Share',
          desc: 'Hit save and instantly get a live link to send to your guests.'
        },
        button: 'Start Designing Now'
      },
      themes: {
        title: 'Themes that stun',
        subtitle: 'Editorial designs usually reserved for magazines.',
        vogue: 'Vogue',
        arch: 'Arch',
        immersive: 'Immersive',
        classic: 'Classic'
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of couples who have created their perfect wedding website',
        button: 'Create Your Website'
      },
      pricing: {
        tagline: 'One-time payment of €19.99 • All features included'
      },
      footer: {
        templates: 'Templates',
        support: 'Support',
        login: 'Login',
        copyright: '© 2026 wdng online Inc.'
      }
    },
    // Navigation
    nav: {
      home: 'Home',
      features: 'Features',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      builder: 'Builder',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      getStarted: 'Get Started'
    },
    // Dashboard
    dashboard: {
      title: 'My Wedding Sites',
      subtitle: 'Manage your wedding websites',
      createNew: 'Create New Site',
      noSites: 'You haven\'t created any wedding sites yet.',
      noSitesAction: 'Create your first wedding website',
      site: {
        published: 'Published',
        draft: 'Draft',
        edit: 'Edit',
        preview: 'Preview',
        settings: 'Settings',
        delete: 'Delete',
        publish: 'Publish',
        unpublish: 'Unpublish',
        lastUpdated: 'Last updated',
        visitors: 'Visitors'
      },
      confirmDelete: 'Are you sure you want to delete this site? This action cannot be undone.'
    },
    // Builder
    builder: {
      title: 'Site Builder',
      welcome: 'Welcome',
      save: 'Save Site',
      signInToSave: 'Sign in to Save',
      preview: 'Live Preview',
      saveSuccess: 'Site saved! It will be available at {subdomain}.wdng.online',
      urlLocked: 'LOCKED',
      urlLockedHint: 'Your subdomain cannot be changed after the first save.',
      sections: {
        title: 'Page Sections',
        add: 'Add Section',
        empty: 'No sections added yet. Click "Add Section" to start building your page body.',
        alreadyAdded: 'Already added to page',
        addToPage: 'Add to page body'
      },
      addSection: 'Add New Section',
      globalSettings: 'Global Settings',
      theme: 'Theme',
      layout: 'Layout',
      yourUrl: 'Your Wedding Site URL',
      urlHint: 'This will be your unique wedding website address',
      bride: 'Bride',
      groom: 'Groom',
      date: 'Date',
      time: 'Time',
      location: 'Location (City, Country)',
      heroImage: 'Hero Background Image',
      guestPhotoAlbum: 'Guest Photo Album',
      albumDescription: 'Connect a Google Photos album where guests can upload their wedding photos.',
      sectionName: 'Section Name',
      sectionTitle: 'Section Title',
      subtitle: 'Subtitle / Description',
      photo: 'Photo',
      backgroundPhoto: 'Background Photo',
      timelineEvents: 'Timeline Events',
      addEvent: 'Add Event',
      questions: 'Questions',
      addQuestion: 'Add Question',
      question: 'Question',
      answer: 'Answer',
      responseDeadline: 'Response Deadline',
      formFields: 'Form Fields',
      addField: 'Add Field',
      label: 'Label',
      type: 'Type',
      required: 'Required',
      fieldTypes: {
        text: 'Text',
        email: 'Email',
        select: 'Dropdown',
        textarea: 'Long Text'
      },
      uploadImage: 'Upload Image',
      changeImage: 'Change Image',
      dragDrop: 'Drag and drop an image here, or click to select',
      maxFileSize: 'Maximum file size: 5MB',
      newEvent: 'New Event',
      newQuestion: 'New Question?',
      answerPlaceholder: 'Answer here.',
      selectOption: 'Select an option',
      respondBy: 'Please respond by',
      sendRsvp: 'Send RSVP',
      enterYour: 'Enter your'
    },
    // Preview (wedding site)
    preview: {
      days: 'Days',
      hours: 'Hrs',
      minutes: 'Min',
      seconds: 'Sec',
      theWedding: 'The Wedding',
      gallery: 'Gallery',
      viewAlbum: 'View Album',
      openInPhotos: 'Open in Google Photos',
      comingSoonTitle: 'Photo Sharing Coming Soon',
      comingSoonSubtitle: 'The couple is setting up their photo album.',
      respondBy: 'Please respond by',
      sendRsvp: 'Send RSVP',
      selectOption: 'Select an option'
    },
    // Section Types
    sectionTypes: {
      events: 'Timeline',
      photos: 'Photo Gallery',
      faq: 'FAQ',
      text: 'Text Block',
      rsvp: 'RSVP Form'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try Again',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      or: 'or'
    }
  },

  de: {
    // Landing Page
    landing: {
      hero: {
        title: 'Erstellen Sie Ihre Traumhochzeitswebsite',
        subtitle: 'Schöne, personalisierte Hochzeitswebsites in wenigen Minuten. Teilen Sie Ihre Liebesgeschichte mit der Welt.',
        cta: 'Jetzt Starten',
        secondaryCta: 'Beispiele Ansehen'
      },
      features: {
        title: 'Alles Was Sie Brauchen',
        subtitle: 'Erstellen Sie eine beeindruckende Hochzeitswebsite mit leistungsstarken Funktionen',
        themes: {
          title: 'Schöne Themes',
          description: 'Wählen Sie aus eleganten, professionell gestalteten Themes'
        },
        rsvp: {
          title: 'RSVP-Verwaltung',
          description: 'Sammeln und verwalten Sie Gästeantworten einfach'
        },
        photos: {
          title: 'Foto-Sharing',
          description: 'Lassen Sie Gäste Hochzeitsfotos hochladen und teilen'
        },
        mobile: {
          title: 'Mobilfreundlich',
          description: 'Perfekte Erfahrung auf jedem Gerät'
        },
        subdomain: {
          title: 'Persönliche Subdomain',
          description: 'Erhalten Sie eine schöne, benutzerdefinierte URL wie ana&luka.wdng.online inklusive.'
        },
        editor: {
          title: 'Echtzeit-Editor',
          description: 'Sehen Sie Ihre Änderungen, während Sie tippen. Unser Split-Screen-Builder macht das Designen intuitiv und schnell.'
        }
      },
      howItWorks: {
        title: 'In 3 einfachen Schritten erstellen.',
        step1: {
          title: 'Wählen Sie Ihren Stil',
          desc: 'Wählen Sie ein Layout und Theme, das zu Ihrem Hochzeitsstil passt.'
        },
        step2: {
          title: 'Details hinzufügen',
          desc: 'Füllen Sie Datum, Ort und Ihre Geschichte aus. Fügen Sie Events zum Zeitplan hinzu.'
        },
        step3: {
          title: 'Veröffentlichen & Teilen',
          desc: 'Speichern Sie und erhalten Sie sofort einen Live-Link zum Teilen mit Ihren Gästen.'
        },
        button: 'Jetzt Gestalten'
      },
      themes: {
        title: 'Atemberaubende Themes',
        subtitle: 'Editorial-Designs, die normalerweise Magazinen vorbehalten sind.',
        vogue: 'Vogue',
        arch: 'Arch',
        immersive: 'Immersiv',
        classic: 'Klassisch'
      },
      cta: {
        title: 'Bereit loszulegen?',
        subtitle: 'Schließen Sie sich Tausenden von Paaren an, die ihre perfekte Hochzeitswebsite erstellt haben',
        button: 'Ihre Website Erstellen'
      },
      pricing: {
        tagline: 'Einmalige Zahlung von 19,99€ • Alle Funktionen inklusive'
      },
      footer: {
        templates: 'Vorlagen',
        support: 'Support',
        login: 'Anmelden',
        copyright: '© 2026 wdng online Inc.'
      }
    },
    // Navigation
    nav: {
      home: 'Startseite',
      features: 'Funktionen',
      pricing: 'Preise',
      dashboard: 'Dashboard',
      builder: 'Builder',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
      getStarted: 'Loslegen'
    },
    // Dashboard
    dashboard: {
      title: 'Meine Hochzeitsseiten',
      subtitle: 'Verwalten Sie Ihre Hochzeitswebsites',
      createNew: 'Neue Seite Erstellen',
      noSites: 'Sie haben noch keine Hochzeitsseiten erstellt.',
      noSitesAction: 'Erstellen Sie Ihre erste Hochzeitswebsite',
      site: {
        published: 'Veröffentlicht',
        draft: 'Entwurf',
        edit: 'Bearbeiten',
        preview: 'Vorschau',
        settings: 'Einstellungen',
        delete: 'Löschen',
        publish: 'Veröffentlichen',
        unpublish: 'Zurückziehen',
        lastUpdated: 'Zuletzt aktualisiert',
        visitors: 'Besucher'
      },
      confirmDelete: 'Sind Sie sicher, dass Sie diese Seite löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
    },
    // Builder
    builder: {
      title: 'Seiten-Builder',
      welcome: 'Willkommen',
      save: 'Seite Speichern',
      signInToSave: 'Anmelden zum Speichern',
      preview: 'Live-Vorschau',
      saveSuccess: 'Seite gespeichert! Sie ist unter {subdomain}.wdng.online verfügbar',
      urlLocked: 'GESPERRT',
      urlLockedHint: 'Ihre Subdomain kann nach dem ersten Speichern nicht mehr geändert werden.',
      sections: {
        title: 'Seitenabschnitte',
        add: 'Abschnitt Hinzufügen',
        empty: 'Noch keine Abschnitte hinzugefügt. Klicken Sie auf "Abschnitt Hinzufügen", um mit dem Aufbau Ihrer Seite zu beginnen.',
        alreadyAdded: 'Bereits zur Seite hinzugefügt',
        addToPage: 'Zur Seite hinzufügen'
      },
      addSection: 'Neuen Abschnitt Hinzufügen',
      globalSettings: 'Globale Einstellungen',
      theme: 'Theme',
      layout: 'Layout',
      yourUrl: 'Ihre Hochzeitsseiten-URL',
      urlHint: 'Dies wird Ihre einzigartige Hochzeitswebsite-Adresse sein',
      bride: 'Braut',
      groom: 'Bräutigam',
      date: 'Datum',
      time: 'Uhrzeit',
      location: 'Ort (Stadt, Land)',
      heroImage: 'Hero-Hintergrundbild',
      guestPhotoAlbum: 'Gäste-Fotoalbum',
      albumDescription: 'Verbinden Sie ein Google Photos-Album, in das Gäste ihre Hochzeitsfotos hochladen können.',
      sectionName: 'Abschnittsname',
      sectionTitle: 'Abschnittstitel',
      subtitle: 'Untertitel / Beschreibung',
      photo: 'Foto',
      backgroundPhoto: 'Hintergrundfoto',
      timelineEvents: 'Zeitplan-Events',
      addEvent: 'Event Hinzufügen',
      questions: 'Fragen',
      addQuestion: 'Frage Hinzufügen',
      question: 'Frage',
      answer: 'Antwort',
      responseDeadline: 'Antwortfrist',
      formFields: 'Formularfelder',
      addField: 'Feld Hinzufügen',
      label: 'Bezeichnung',
      type: 'Typ',
      required: 'Erforderlich',
      fieldTypes: {
        text: 'Text',
        email: 'E-Mail',
        select: 'Dropdown',
        textarea: 'Langer Text'
      },
      uploadImage: 'Bild Hochladen',
      changeImage: 'Bild Ändern',
      dragDrop: 'Ziehen Sie ein Bild hierher oder klicken Sie zur Auswahl',
      maxFileSize: 'Maximale Dateigröße: 5MB',
      newEvent: 'Neues Event',
      newQuestion: 'Neue Frage?',
      answerPlaceholder: 'Antwort hier.',
      selectOption: 'Option auswählen',
      respondBy: 'Bitte antworten bis',
      sendRsvp: 'RSVP Senden',
      enterYour: 'Geben Sie Ihre/Ihren'
    },
    // Preview (wedding site)
    preview: {
      days: 'Tage',
      hours: 'Std',
      minutes: 'Min',
      seconds: 'Sek',
      theWedding: 'Die Hochzeit',
      gallery: 'Galerie',
      viewAlbum: 'Album Ansehen',
      openInPhotos: 'In Google Photos öffnen',
      comingSoonTitle: 'Foto-Sharing Kommt Bald',
      comingSoonSubtitle: 'Das Paar richtet sein Fotoalbum ein.',
      respondBy: 'Bitte antworten bis',
      sendRsvp: 'RSVP Senden',
      selectOption: 'Option auswählen'
    },
    // Section Types
    sectionTypes: {
      events: 'Zeitplan',
      photos: 'Fotogalerie',
      faq: 'FAQ',
      text: 'Textblock',
      rsvp: 'RSVP-Formular'
    },
    // Common
    common: {
      loading: 'Wird geladen...',
      error: 'Etwas ist schief gelaufen',
      retry: 'Erneut Versuchen',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      close: 'Schließen',
      back: 'Zurück',
      next: 'Weiter',
      or: 'oder'
    }
  },

  hr: {
    // Landing Page
    landing: {
      hero: {
        title: 'Izradite Web Stranicu Za Vjenčanje',
        subtitle: 'Prekrasne, personalizirane web stranice za vjenčanje u nekoliko minuta. Podijelite svoju ljubavnu priču sa svijetom.',
        cta: 'Započni Sada',
        secondaryCta: 'Pogledaj Primjere'
      },
      features: {
        title: 'Sve Što Vam Treba',
        subtitle: 'Izradite zadivljujuću web stranicu za vjenčanje s moćnim značajkama',
        themes: {
          title: 'Prekrasne Teme',
          description: 'Odaberite između elegantnih, profesionalno dizajniranih tema'
        },
        rsvp: {
          title: 'Upravljanje Pozivnicama',
          description: 'Jednostavno prikupljajte i upravljajte odgovorima gostiju'
        },
        photos: {
          title: 'Dijeljenje Fotografija',
          description: 'Omogućite gostima da prenose i dijele fotografije s vjenčanja'
        },
        mobile: {
          title: 'Prilagođeno Mobilnim Uređajima',
          description: 'Savršeno iskustvo na bilo kojem uređaju'
        },
        subdomain: {
          title: 'Osobna Poddomena',
          description: 'Dobijte prekrasnu, prilagođenu URL adresu poput ana&luka.wdng.online uključenu u cijenu.'
        },
        editor: {
          title: 'Uređivač u Stvarnom Vremenu',
          description: 'Vidite promjene dok tipkate. Naš podijeljeni zaslon čini dizajniranje intuitivnim i brzim.'
        }
      },
      howItWorks: {
        title: 'Izradite u 3 jednostavna koraka.',
        step1: {
          title: 'Odaberite stil',
          desc: 'Odaberite raspored i temu koja odgovara stilu vašeg vjenčanja.'
        },
        step2: {
          title: 'Dodajte detalje',
          desc: 'Unesite datum, lokaciju i vašu priču. Dodajte događaje u raspored.'
        },
        step3: {
          title: 'Objavite i Podijelite',
          desc: 'Spremite i odmah dobijte poveznicu za slanje gostima.'
        },
        button: 'Počni Dizajnirati'
      },
      themes: {
        title: 'Teme koje osvajaju',
        subtitle: 'Urednički dizajni obično rezervirani za časopise.',
        vogue: 'Vogue',
        arch: 'Arch',
        immersive: 'Immersive',
        classic: 'Klasična'
      },
      cta: {
        title: 'Spremni Za Početak?',
        subtitle: 'Pridružite se tisućama parova koji su izradili svoju savršenu web stranicu za vjenčanje',
        button: 'Izradite Svoju Web Stranicu'
      },
      pricing: {
        tagline: 'Jednokratno plaćanje od 19,99€ • Sve značajke uključene'
      },
      footer: {
        templates: 'Predlošci',
        support: 'Podrška',
        login: 'Prijava',
        copyright: '© 2026 wdng online Inc.'
      }
    },
    // Navigation
    nav: {
      home: 'Početna',
      features: 'Značajke',
      pricing: 'Cijene',
      dashboard: 'Nadzorna Ploča',
      builder: 'Graditelj',
      signIn: 'Prijava',
      signOut: 'Odjava',
      getStarted: 'Započni'
    },
    // Dashboard
    dashboard: {
      title: 'Moje Stranice Za Vjenčanje',
      subtitle: 'Upravljajte svojim web stranicama za vjenčanje',
      createNew: 'Izradi Novu Stranicu',
      noSites: 'Još niste izradili nijednu stranicu za vjenčanje.',
      noSitesAction: 'Izradite svoju prvu web stranicu za vjenčanje',
      site: {
        published: 'Objavljeno',
        draft: 'Skica',
        edit: 'Uredi',
        preview: 'Pregled',
        settings: 'Postavke',
        delete: 'Obriši',
        publish: 'Objavi',
        unpublish: 'Povuci',
        lastUpdated: 'Zadnja izmjena',
        visitors: 'Posjetitelji'
      },
      confirmDelete: 'Jeste li sigurni da želite obrisati ovu stranicu? Ova se radnja ne može poništiti.'
    },
    // Builder
    builder: {
      title: 'Graditelj Stranica',
      welcome: 'Dobrodošli',
      save: 'Spremi Stranicu',
      signInToSave: 'Prijavite se za spremanje',
      preview: 'Pregled Uživo',
      saveSuccess: 'Stranica spremljena! Dostupna je na {subdomain}.wdng.online',
      urlLocked: 'ZAKLJUČANO',
      urlLockedHint: 'Vaša poddomena se ne može promijeniti nakon prvog spremanja.',
      sections: {
        title: 'Odjeljci Stranice',
        add: 'Dodaj Odjeljak',
        empty: 'Još nema dodanih odjeljaka. Kliknite "Dodaj Odjeljak" za početak izgradnje vaše stranice.',
        alreadyAdded: 'Već dodano na stranicu',
        addToPage: 'Dodaj na stranicu'
      },
      addSection: 'Dodaj Novi Odjeljak',
      globalSettings: 'Globalne Postavke',
      theme: 'Tema',
      layout: 'Raspored',
      yourUrl: 'URL Vaše Stranice Za Vjenčanje',
      urlHint: 'Ovo će biti vaša jedinstvena adresa web stranice za vjenčanje',
      bride: 'Mladenka',
      groom: 'Mladoženja',
      date: 'Datum',
      time: 'Vrijeme',
      location: 'Lokacija (Grad, Država)',
      heroImage: 'Pozadinska Slika',
      guestPhotoAlbum: 'Album Fotografija Gostiju',
      albumDescription: 'Povežite Google Photos album u koji gosti mogu prenijeti svoje fotografije s vjenčanja.',
      sectionName: 'Naziv Odjeljka',
      sectionTitle: 'Naslov Odjeljka',
      subtitle: 'Podnaslov / Opis',
      photo: 'Fotografija',
      backgroundPhoto: 'Pozadinska Fotografija',
      timelineEvents: 'Raspored Događaja',
      addEvent: 'Dodaj Događaj',
      questions: 'Pitanja',
      addQuestion: 'Dodaj Pitanje',
      question: 'Pitanje',
      answer: 'Odgovor',
      responseDeadline: 'Rok Za Odgovor',
      formFields: 'Polja Obrasca',
      addField: 'Dodaj Polje',
      label: 'Oznaka',
      type: 'Vrsta',
      required: 'Obavezno',
      fieldTypes: {
        text: 'Tekst',
        email: 'E-pošta',
        select: 'Padajući Izbornik',
        textarea: 'Dugi Tekst'
      },
      uploadImage: 'Prenesi Sliku',
      changeImage: 'Promijeni Sliku',
      dragDrop: 'Povucite sliku ovdje ili kliknite za odabir',
      maxFileSize: 'Maksimalna veličina datoteke: 5MB',
      newEvent: 'Novi Događaj',
      newQuestion: 'Novo Pitanje?',
      answerPlaceholder: 'Odgovor ovdje.',
      selectOption: 'Odaberite opciju',
      respondBy: 'Molimo odgovorite do',
      sendRsvp: 'Pošalji RSVP',
      enterYour: 'Unesite vaš/vašu'
    },
    // Preview (wedding site)
    preview: {
      days: 'Dana',
      hours: 'Sati',
      minutes: 'Min',
      seconds: 'Sek',
      theWedding: 'Vjenčanje',
      gallery: 'Galerija',
      viewAlbum: 'Pogledaj Album',
      openInPhotos: 'Otvori u Google Photos',
      comingSoonTitle: 'Dijeljenje Fotografija Uskoro',
      comingSoonSubtitle: 'Par postavlja svoj fotoalbum.',
      respondBy: 'Molimo odgovorite do',
      sendRsvp: 'Pošalji RSVP',
      selectOption: 'Odaberite opciju'
    },
    // Section Types
    sectionTypes: {
      events: 'Raspored',
      photos: 'Galerija Fotografija',
      faq: 'Česta Pitanja',
      text: 'Tekstualni Blok',
      rsvp: 'RSVP Obrazac'
    },
    // Common
    common: {
      loading: 'Učitavanje...',
      error: 'Nešto je pošlo po zlu',
      retry: 'Pokušaj Ponovo',
      cancel: 'Odustani',
      confirm: 'Potvrdi',
      save: 'Spremi',
      delete: 'Obriši',
      edit: 'Uredi',
      close: 'Zatvori',
      back: 'Natrag',
      next: 'Dalje',
      or: 'ili'
    }
  }
} as const;

export type TranslationKeys = typeof translations['en'];

export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] as TranslationKeys || translations.en;
}

export function t(locale: Locale, path: string): string {
  const keys = path.split('.');
  let value: unknown = translations[locale] || translations.en;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path; // Return the path if translation not found
    }
  }
  
  return typeof value === 'string' ? value : path;
}
