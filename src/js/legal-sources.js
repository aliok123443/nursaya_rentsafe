import { checklistData } from './data.js';

export const legalDocuments = {
  civilGeneral: {
    title: {
      kk: 'Қазақстан Республикасының Азаматтық кодексі (Жалпы бөлім)',
      ru: 'Гражданский кодекс Республики Казахстан (Общая часть)',
      en: 'Civil Code of the Republic of Kazakhstan (General Part)'
    },
    number: '№ 268-XIII',
    date: '1994-12-27',
    url: 'https://adilet.zan.kz/rus/docs/K940001000_'
  },
  civilSpecial: {
    title: {
      kk: 'Қазақстан Республикасының Азаматтық кодексі (Ерекше бөлім)',
      ru: 'Гражданский кодекс Республики Казахстан (Особенная часть)',
      en: 'Civil Code of the Republic of Kazakhstan (Special Part)'
    },
    number: '№ 409',
    date: '1999-07-01',
    url: 'https://adilet.zan.kz/rus/docs/K990000409_'
  },
  housing: {
    title: {
      kk: 'Тұрғын үй қатынастары туралы',
      ru: 'О жилищных отношениях',
      en: 'On Housing Relations'
    },
    number: '№ 94',
    date: '1997-04-16',
    url: 'https://adilet.zan.kz/rus/docs/Z970000094_'
  },
  registrationRights: {
    title: {
      kk: 'Жылжымайтын мүлікке құқықтарды мемлекеттік тіркеу туралы',
      ru: 'О государственной регистрации прав на недвижимое имущество',
      en: 'On State Registration of Rights to Immovable Property'
    },
    number: '№ 310',
    date: '2007-07-26',
    url: 'https://adilet.zan.kz/rus/docs/Z070000310_'
  },
  migration: {
    title: {
      kk: 'Халықтың көші-қоны туралы',
      ru: 'О миграции населения',
      en: 'On Migration'
    },
    number: '№ 477-IV',
    date: '2011-07-22',
    url: 'https://adilet.zan.kz/rus/docs/Z1100000477_'
  },
  registrationRules: {
    title: {
      kk: 'Халықты тіркеу қағидалары',
      ru: 'Правила регистрации населения',
      en: 'Rules for Population Registration'
    },
    number: 'Приказ № 677',
    date: '2024-09-09',
    url: 'https://adilet.zan.kz/rus/docs/V2400035045_'
  },
  tax: {
    title: {
      kk: 'Қазақстан Республикасының Салық кодексі',
      ru: 'Налоговый кодекс Республики Казахстан',
      en: 'Tax Code of the Republic of Kazakhstan'
    },
    number: '№ 214-VIII',
    date: '2025-07-18',
    url: 'https://adilet.zan.kz/rus/docs/K2500000214_'
  },
  selfEmployed: {
    title: {
      kk: 'Өзін-өзі жұмыспен қамтығандарға арналған арнаулы салық режимі үшін қызмет түрлерінің тізбесін бекіту туралы',
      ru: 'Об утверждении перечня видов деятельности для применения специального налогового режима для самозанятых',
      en: 'On the Activity List for the Special Tax Regime for Self-Employed Persons'
    },
    number: 'Постановление № 994',
    date: '2025-11-21',
    url: 'https://adilet.zan.kz/rus/docs/P2500000994_'
  },
  personalData: {
    title: {
      kk: 'Дербес деректер және оларды қорғау туралы',
      ru: 'О персональных данных и их защите',
      en: 'On Personal Data and Their Protection'
    },
    number: '№ 94-V',
    date: '2013-05-21',
    url: 'https://adilet.zan.kz/rus/docs/Z1300000094_'
  },
  consumer: {
    title: {
      kk: 'Тұтынушылардың құқықтарын қорғау туралы',
      ru: 'О защите прав потребителей',
      en: 'On Consumer Protection'
    },
    number: '№ 274',
    date: '2010-05-04',
    url: 'https://adilet.zan.kz/rus/docs/Z100000274_'
  },
  administrative: {
    title: {
      kk: 'Әкімшілік құқық бұзушылық туралы кодекс',
      ru: 'Кодекс об административных правонарушениях',
      en: 'Code of Administrative Offences'
    },
    number: '№ 235-V',
    date: '2014-07-05',
    url: 'https://adilet.zan.kz/rus/docs/K1400000235_'
  },
  immigrationRules: {
    title: {
      kk: 'Иммигранттардың Қазақстан Республикасына келу және онда болу қағидалары',
      ru: 'Правила въезда и пребывания иммигрантов в Республике Казахстан',
      en: 'Rules for Entry and Stay of Immigrants in Kazakhstan'
    },
    number: 'Постановление № 148',
    date: '2012-01-21',
    url: ''
  },
  constitution: {
    title: {
      kk: 'Қазақстан Республикасының Конституциясы',
      ru: 'Конституция Республики Казахстан',
      en: 'Constitution of the Republic of Kazakhstan'
    },
    number: '',
    date: '1995-08-30',
    url: 'https://adilet.zan.kz/rus/docs/K950001000_'
  },
  kgdSelfEmployed: {
    title: {
      kk: 'Мемлекеттік кірістер комитетінің өзін-өзі жұмыспен қамтығандарға арналған түсіндірмесі',
      ru: 'Разъяснение Комитета государственных доходов о режиме для самозанятых',
      en: 'State Revenue Committee guidance on the self-employed regime'
    },
    number: '',
    date: '',
    url: 'https://www.gov.kz/org/kgd-abay/documents/details/1068535?lang=ru'
  },
  egovRegistration: {
    title: {
      kk: 'Тұрғылықты жері бойынша азаматтарды тіркеу мемлекеттік қызметі',
      ru: 'Государственная услуга по регистрации граждан по месту жительства',
      en: 'eGov residence registration service'
    },
    number: '',
    date: '',
    url: 'https://egov.kz/cms/ru/services/registration/reg_grazhdan'
  }
};

const referenceByItem = {
  'prepare-1': ['recommendation', 'housing', '24'],
  'prepare-2': ['recommendation', 'housing', '24'],
  'prepare-3': ['contract', 'civilSpecial', '546'],
  'docs-1': ['law', 'civilSpecial', '543'],
  'docs-2': ['recommendation', 'personalData', '7, 8, 11, 12'],
  'docs-3': ['law', 'housing', '25'],
  'contract-1': ['contract', 'civilSpecial', '540, 542, 601'],
  'contract-2': ['contract', 'civilSpecial', '545, 546'],
  'contract-3': ['contract', 'civilSpecial', '546'],
  'tenant-1': ['recommendation', 'housing', '23, 24'],
  'tenant-2': ['contract', 'civilSpecial', '550'],
  'tenant-3': ['recommendation', 'civilSpecial', '548'],
  'handover-1': ['recommendation', 'civilSpecial', '547, 548'],
  'handover-2': ['contract', 'civilSpecial', '547'],
  'handover-3': ['contract', 'civilSpecial', '547'],
  'payments-1': ['contract', 'civilSpecial', '546'],
  'payments-2': ['contract', 'civilGeneral', '401–405'],
  'payments-3': ['recommendation', 'tax', '718–720'],
  'tax-1': ['law', 'tax', '718–720'],
  'tax-2': ['law', 'tax', '718–720'],
  'tax-3': ['recommendation', 'kgdSelfEmployed', ''],
  'closing-1': ['recommendation', 'civilSpecial', '547, 548'],
  'closing-2': ['contract', 'civilGeneral', '401–405'],
  'closing-3': ['recommendation', 'personalData', '11, 12, 18']
};

const categoryLabels = {
  law: { kk: 'Заңнамалық норма', ru: 'Норма закона', en: 'Statutory provision' },
  contract: { kk: 'Шартта келісілетін талап', ru: 'Условие договора', en: 'Contract term' },
  recommendation: { kk: 'Практикалық ұсыным', ru: 'Практическая рекомендация', en: 'Practical recommendation' }
};

export const legalReferences = checklistData.flatMap((category) => category.items.map((item) => {
  const [basisType, documentId, articles] = referenceByItem[item.id];
  return {
    id: `source-${item.id}`,
    checklistItemId: item.id,
    title: item.text,
    explanation: item.explanation,
    basisType,
    basisLabel: categoryLabels[basisType],
    document: legalDocuments[documentId],
    article: articles,
    officialUrl: legalDocuments[documentId].url,
    status: 'NEEDS_REVIEW'
  };
}));

export function getLegalReference(checklistItemId) {
  return legalReferences.find((reference) => reference.checklistItemId === checklistItemId);
}
