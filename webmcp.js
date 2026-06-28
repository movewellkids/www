// =============================================================================
// WebMCP agent tools  —  https://github.com/webmachinelearning/webmcp
// -----------------------------------------------------------------------------
// Exposes MoveWellKids' services, pricing, coverage area and contact path as
// structured tools that AI agents can call directly, instead of inferring them
// from the DOM. Feature-detected: inert in browsers that don't support WebMCP.
//
// This file's DATA object is the hand-curated source of truth for the tools.
// Keep it in sync with llm.txt and the site content when services change.
// =============================================================================

(function () {
  'use strict';

  const mc = window.navigator && window.navigator.modelContext;
  if (!mc) return; // No WebMCP support — do nothing.

  // ---------------------------------------------------------------------------
  // Data (source of truth — mirror of llm.txt)
  // ---------------------------------------------------------------------------
  const CONTACT = {
    email: 'hello@movewellkids.co.uk',
    website: 'https://movewellkids.co.uk',
    responseTime: 'within one working day'
  };

  const PRICING = {
    sessions: [
      { name: 'New patient assessment', minutes: 60 },
      { name: 'Follow-up session', minutes: 45 },
      { name: 'Short follow-up', minutes: 30 }
    ],
    feeRange: '£75–£120 per session',
    agesSeen: 'birth to 18 years',
    gpReferralRequired: false
  };

  // Home-visit coverage. `districts` are SE outward codes; `areas` are place
  // names. check_coverage matches against both.
  const COVERAGE = {
    districts: ['SE15', 'SE19', 'SE21', 'SE22', 'SE23', 'SE24', 'SE27'],
    areas: [
      'East Dulwich', 'Dulwich Village', 'West Dulwich', 'Herne Hill',
      'Tulse Hill', 'West Norwood', 'Gipsy Hill', 'Crystal Palace',
      'Forest Hill', 'Peckham'
    ],
    region: 'South London',
    note: 'and surrounding areas'
  };

  // ageGroup: 'infant' | 'child-teen' | 'all'
  const SERVICES = [
    {
      name: 'Baby MOT',
      ageGroup: 'infant',
      summary: 'Personalised developmental screening for babies, including a musculoskeletal and neurological profile review.',
      aka: ['baby development check', 'infant development assessment', 'newborn physical screening']
    },
    {
      name: 'Developmental Delay',
      ageGroup: 'infant',
      summary: 'Support for children not meeting expected physical milestones.',
      aka: ['gross motor delay', 'global developmental delay', 'GDD', 'motor milestone delay', 'hypotonia', 'floppy baby', 'low tone', 'head lag', 'late walking', 'bottom shuffling', 'W-sitting']
    },
    {
      name: 'Torticollis & Plagiocephaly',
      ageGroup: 'infant',
      summary: 'Assessment and treatment for babies with a head-turning preference, torticollis, or flat head.',
      aka: ['wry neck', 'twisted neck', 'flat head', 'plagiocephaly', 'brachycephaly', 'flat head syndrome', 'head turning preference', 'preferential head position']
    },
    {
      name: 'Positional Talipes',
      ageGroup: 'infant',
      summary: 'Treatment for foot-position concerns in newborns.',
      aka: ['positional clubfoot', 'foot turning in baby', 'curly foot']
    },
    {
      name: "Erb's Palsy",
      ageGroup: 'infant',
      summary: 'Targeted exercise programmes to improve arm movement, strength and function.',
      aka: ['brachial plexus injury', 'neonatal brachial plexus palsy', 'birth-related arm weakness']
    },
    {
      name: 'Musculoskeletal Pain & Injury',
      ageGroup: 'all',
      summary: 'Assessment and treatment of joint, muscle and soft-tissue pain, including growth-related conditions and a wide range of overuse / apophysitis presentations.',
      aka: ['growing pains', 'benign limb pains of childhood', 'heel pain', 'knee pain', "Sever's", 'calcaneal apophysitis', "Osgood-Schlatter's", 'tibial tuberosity apophysitis', 'patellofemoral pain', 'anterior knee pain', "runner's knee", 'Sinding-Larsen-Johansson', 'Iselin disease', "little leaguer's elbow", "Panner's disease", 'plantar fasciitis', 'Achilles tendinopathy', 'patellar tendinopathy', "jumper's knee", 'snapping hip', 'coxa saltans', 'costochondritis', 'discoid meniscus', 'spondylolysis', 'pars defect', 'stress fracture', 'bone stress reaction']
    },
    {
      name: 'Hypermobility & EDS',
      ageGroup: 'child-teen',
      summary: 'Physiotherapy for hypermobile children and teenagers, including graded-exercise rehab for POTS and dysautonomia in hEDS teens.',
      aka: ['double-jointed', 'joint laxity', 'loose joints', 'bendy joints', 'hypermobility spectrum disorder', 'HSD', 'hEDS', 'Ehlers-Danlos Syndrome', 'recurrent joint subluxations', 'POTS', 'postural orthostatic tachycardia syndrome', 'dysautonomia']
    },
    {
      name: 'Gait Abnormalities',
      ageGroup: 'child-teen',
      summary: 'Assessment of toe walking, in-toeing, out-toeing, tibial torsion, flat-foot gait, limping and other gait concerns.',
      aka: ['toe walking', 'idiopathic toe walking', 'equinus gait', 'in-toeing', 'pigeon toed', 'femoral anteversion', 'internal tibial torsion', 'metatarsus adductus', 'out-toeing', 'duck-footed', 'femoral retroversion', 'external tibial torsion', 'tibial torsion', 'flexible flatfoot', 'antalgic gait', 'limping gait']
    },
    {
      name: 'Sports Injuries',
      ageGroup: 'child-teen',
      summary: 'Rehabilitation for young athletes returning to sport after injury.',
      aka: ['youth sports injury', 'return-to-sport rehab', 'paediatric sports physiotherapy', 'iliotibial band syndrome', 'ITB', 'shin splints', 'medial tibial stress syndrome', 'MTSS', 'gymnast back pain', 'cricketer back pain', 'wrist overuse']
    },
    {
      name: 'Chronic Pain',
      ageGroup: 'child-teen',
      summary: 'Management of persistent pain conditions in children and teenagers.',
      aka: ['paediatric pain', 'complex regional pain syndrome', 'CRPS', 'amplified musculoskeletal pain']
    },
    {
      name: 'Juvenile Arthritis',
      ageGroup: 'child-teen',
      summary: 'Physiotherapy support for children with juvenile idiopathic arthritis and other inflammatory conditions.',
      aka: ['JIA', 'juvenile idiopathic arthritis', 'juvenile rheumatoid arthritis']
    },
    {
      name: 'Postural Assessment',
      ageGroup: 'child-teen',
      summary: 'Evaluation and treatment of postural concerns including scoliosis, kyphosis, bow legs, knock knees, chest-wall differences and non-specific back pain in teenagers.',
      aka: ['scoliosis', 'curved spine', 'kyphosis', 'hunched back', 'rounded upper back', 'bow legs', 'genu varum', 'knock knees', 'genu valgum', 'pectus excavatum', 'sunken chest', 'pectus carinatum', 'pigeon chest', 'forward head posture', 'tech neck', 'anterior pelvic tilt', 'flexible flatfoot', 'pes planus', 'high arches', 'pes cavus', 'back pain']
    },
    {
      name: 'Post-Surgical Rehabilitation',
      ageGroup: 'child-teen',
      summary: 'Community-phase physiotherapy following orthopaedic or other surgery (fractures, knee, hip, foot & ankle, spine, upper limb, guided growth / limb-lengthening procedures).',
      aka: ['post-operative physiotherapy', 'post-op rehab', 'orthopaedic rehab', 'ACL reconstruction', 'meniscal repair', 'MPFL', 'patellar stabilisation', 'DDH', 'Pavlik harness', 'Perthes', 'SCFE', 'SUFE', 'Ponseti casting', 'clubfoot', 'spinal fusion', 'growing rods', 'MAGEC', 'epiphysiodesis', 'limb lengthening', 'PRECICE', 'Ilizarov']
    }
  ];

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const text = (s) => ({ content: [{ type: 'text', text: s }] });
  // Lower-case, drop apostrophes (so "Severs" matches "Sever's"), trim.
  const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/['’]/g, '').trim();

  function serviceLine(s) {
    return `• ${s.name} (${s.ageGroup}): ${s.summary}`;
  }

  // ---------------------------------------------------------------------------
  // Tool definitions
  // ---------------------------------------------------------------------------
  const tools = [
    {
      name: 'list_services',
      description: "List the paediatric physiotherapy services MoveWellKids offers. MoveWellKids treats babies, children and teenagers only (ages 0–18); it does not see adults. Optionally filter by age group ('infant' or 'child-teen') or a free-text keyword.",
      inputSchema: {
        type: 'object',
        properties: {
          ageGroup: { type: 'string', enum: ['infant', 'child-teen'], description: 'Filter to services for this age group.' },
          keyword: { type: 'string', description: 'Free-text keyword to match against service names, summaries and synonyms.' }
        }
      },
      async execute({ ageGroup, keyword } = {}) {
        let list = SERVICES.slice();
        if (ageGroup) list = list.filter(s => s.ageGroup === ageGroup || s.ageGroup === 'all');
        if (keyword) {
          const k = norm(keyword);
          list = list.filter(s =>
            norm(s.name).includes(k) ||
            norm(s.summary).includes(k) ||
            s.aka.some(a => norm(a).includes(k))
          );
        }
        if (!list.length) return text('No matching services found. MoveWellKids may still be able to help — email ' + CONTACT.email + ' to ask.');
        return text(list.map(serviceLine).join('\n'));
      }
    },
    {
      name: 'find_condition',
      description: 'Check whether MoveWellKids treats a specific condition, symptom or diagnosis (e.g. "toe walking", "Sever\'s disease", "flat head") and find which service it falls under. MoveWellKids only treats babies, children and teenagers (ages 0–18), not adults.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The condition, symptom or diagnosis to look up.' }
        },
        required: ['query']
      },
      async execute({ query } = {}) {
        const q = norm(query);
        if (!q) return text('Please provide a condition or symptom to look up.');
        const matches = SERVICES.filter(s =>
          norm(s.name).includes(q) ||
          norm(s.summary).includes(q) ||
          s.aka.some(a => norm(a).includes(q) || q.includes(norm(a)))
        );
        if (!matches.length) {
          return text(`"${query}" isn't listed among the named conditions, but MoveWellKids treats a broad range of paediatric musculoskeletal and developmental presentations. Email ${CONTACT.email} to check.`);
        }
        return text(
          `Yes — "${query}" is treated under:\n` +
          matches.map(s => `• ${s.name}: ${s.summary}`).join('\n')
        );
      }
    },
    {
      name: 'get_pricing',
      description: 'Get session types, durations, fees, ages seen and referral requirements for MoveWellKids paediatric physiotherapy.',
      inputSchema: { type: 'object', properties: {} },
      outputSchema: {
        type: 'object',
        properties: {
          sessions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                minutes: { type: 'number' }
              },
              required: ['name', 'minutes']
            }
          },
          feeRange: { type: 'string' },
          agesSeen: { type: 'string' },
          gpReferralRequired: { type: 'boolean' },
          homeVisitsOnly: { type: 'boolean' }
        },
        required: ['sessions', 'feeRange', 'agesSeen', 'gpReferralRequired', 'homeVisitsOnly']
      },
      async execute() {
        const lines = [
          'Sessions:',
          ...PRICING.sessions.map(s => `• ${s.name}: ${s.minutes} minutes`),
          `Fees: ${PRICING.feeRange}`,
          `Ages seen: ${PRICING.agesSeen}`,
          `GP referral: ${PRICING.gpReferralRequired ? 'required' : 'not required'}`,
          'All sessions are home visits.'
        ];
        return {
          content: [{ type: 'text', text: lines.join('\n') }],
          structuredContent: {
            sessions: PRICING.sessions,
            feeRange: PRICING.feeRange,
            agesSeen: PRICING.agesSeen,
            gpReferralRequired: PRICING.gpReferralRequired,
            homeVisitsOnly: true
          }
        };
      }
    },
    {
      name: 'check_coverage',
      description: 'Check whether MoveWellKids offers home visits to a given area or postcode in South London.',
      inputSchema: {
        type: 'object',
        properties: {
          area: { type: 'string', description: 'A postcode (e.g. "SE23 3PQ") or place name (e.g. "Herne Hill").' }
        },
        required: ['area']
      },
      outputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          covered: { type: 'boolean' },
          matchedBy: { type: 'string', enum: ['district', 'area', 'none'] },
          region: { type: 'string' },
          coveredAreas: { type: 'array', items: { type: 'string' } },
          coveredDistricts: { type: 'array', items: { type: 'string' } }
        },
        required: ['query', 'covered', 'matchedBy', 'region', 'coveredAreas', 'coveredDistricts']
      },
      async execute({ area } = {}) {
        const a = norm(area);
        const coveredList = `Covered areas: ${COVERAGE.areas.join(', ')} (${COVERAGE.districts.join(', ')}) in ${COVERAGE.region}.`;
        const base = {
          query: area == null ? '' : String(area),
          region: COVERAGE.region,
          coveredAreas: COVERAGE.areas,
          coveredDistricts: COVERAGE.districts
        };
        const result = (covered, matchedBy, msg) => ({
          content: [{ type: 'text', text: msg }],
          structuredContent: Object.assign({ covered, matchedBy }, base)
        });

        if (!a) return result(false, 'none', 'Please provide a postcode or area name. ' + coveredList);

        // Postcode outward-code match (e.g. "se23 3pq" -> "SE23")
        const outward = (a.match(/se\s?\d{1,2}/) || [])[0];
        const outwardCode = outward ? outward.replace(/\s/g, '').toUpperCase() : null;
        const byDistrict = outwardCode && COVERAGE.districts.includes(outwardCode);
        const byArea = COVERAGE.areas.some(name => a.includes(norm(name)) || norm(name).includes(a));

        if (byDistrict || byArea) {
          return result(true, byDistrict ? 'district' : 'area', `Yes — home visits are available in ${area}. ${coveredList}`);
        }
        return result(false, 'none', `${area} isn't in the standard home-visit area, but you're welcome to email ${CONTACT.email} to ask. ${coveredList}`);
      }
    },
    {
      name: 'start_enquiry',
      description: "Start a booking/enquiry. Composes a pre-filled email to MoveWellKids and opens the user's email client for them to review and send. Does not send automatically.",
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: "The enquirer's name." },
          email: { type: 'string', description: "The enquirer's email address." },
          childAge: { type: 'string', description: "The child's age (optional)." },
          service: { type: 'string', description: 'The service or concern of interest (optional).' },
          message: { type: 'string', description: 'The enquiry message.' }
        },
        required: ['name', 'email', 'message']
      },
      async execute({ name, email, childAge, service, message } = {}) {
        const subject = service ? `Enquiry: ${service}` : 'Physiotherapy enquiry';
        const bodyLines = [
          `Name: ${name}`,
          `Email: ${email}`,
          childAge ? `Child's age: ${childAge}` : null,
          service ? `Service of interest: ${service}` : null,
          '',
          message
        ].filter(l => l !== null);
        const href = `mailto:${CONTACT.email}` +
          `?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(bodyLines.join('\n'))}`;
        try {
          window.location.href = href;
        } catch (e) { /* navigation blocked — fall through to instructions */ }
        return text(
          `A pre-filled email to ${CONTACT.email} has been opened for you to review and send. ` +
          `If it didn't open, email ${CONTACT.email} directly. We aim to respond ${CONTACT.responseTime}.`
        );
      }
    }
  ];

  // ---------------------------------------------------------------------------
  // Registration — tolerate both spec shapes.
  // ---------------------------------------------------------------------------
  if (typeof mc.registerTool === 'function') {
    tools.forEach(t => mc.registerTool(t));
  } else if (typeof mc.provideContext === 'function') {
    mc.provideContext({ tools });
  }
})();
