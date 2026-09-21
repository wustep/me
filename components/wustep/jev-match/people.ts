import type { Person, YouProfile } from './types'

export const DEFAULT_YOU: YouProfile = {
  name: 'Alex Rivers',
  city: 'Oakland',
  bio: 'Writes on weeknights, climbs on weekends, cooks when the fridge looks like a dare.',
  energy: 'adventurous',
  hobbies: ['climbing', 'cooking', 'jazz'],
  lookingFor: ['weekend adventures', 'slow dinners', 'a climbing partner']
}

/**
 * Fictional nobodies only. No real contacts, no production Matchmake data.
 */
export const PEOPLE: Person[] = [
  {
    id: 'nia-calder',
    name: 'Nia Calder',
    age: 31,
    city: 'Oakland',
    energy: 'adventurous',
    hobbies: ['climbing', 'pottery', 'trail running'],
    lookingFor: ['weekend adventures', 'a climbing partner', 'someone local'],
    bio: 'Sets easy sport on the weekends and a kiln on Tuesdays. Keeps a chalk bag in the car on purpose.'
  },
  {
    id: 'theo-marsh',
    name: 'Theo Marsh',
    age: 28,
    city: 'Oakland',
    energy: 'social',
    hobbies: ['jazz', 'cooking', 'board games'],
    lookingFor: ['slow dinners', 'someone local', 'co-working company'],
    bio: 'Makes too much pasta and then texts the group chat. Has opinions about cymbals.'
  },
  {
    id: 'wren-solis',
    name: 'Wren Solis',
    age: 34,
    city: 'Berkeley',
    energy: 'calm',
    hobbies: ['birding', 'trail running', 'poetry'],
    lookingFor: ['quiet mornings', 'long walks', 'someone local'],
    bio: 'Up before the jays. Writes in the margins of field guides and pretends that counts.'
  },
  {
    id: 'luca-penn',
    name: 'Luca Penn',
    age: 29,
    city: 'San Francisco',
    energy: 'adventurous',
    hobbies: ['cycling', 'board games', 'bouldering'],
    lookingFor: ['a climbing partner', 'weekend adventures', 'a travel buddy'],
    bio: 'Rides to the gym so the session counts twice. Owns three decks of the same game.'
  },
  {
    id: 'hadiya-brooks',
    name: 'Hadiya Brooks',
    age: 36,
    city: 'Oakland',
    energy: 'calm',
    hobbies: ['fermentation', 'language exchange', 'cooking'],
    lookingFor: ['slow dinners', 'quiet mornings', 'someone local'],
    bio: 'Currently babysitting a crock of hot sauce. Will trade a jar for a story in another language.'
  },
  {
    id: 'owen-vale',
    name: 'Owen Vale',
    age: 27,
    city: 'San Francisco',
    energy: 'social',
    hobbies: ['house shows', 'film photography', 'jazz'],
    lookingFor: ['a bandmate', 'weekend adventures', 'co-working company'],
    bio: 'Books tiny rooms and then stands in the back taking pictures instead of talking.'
  },
  {
    id: 'mira-ellison',
    name: 'Mira Ellison',
    age: 33,
    city: 'Oakland',
    energy: 'adventurous',
    hobbies: ['sailing', 'climbing', 'museums'],
    lookingFor: ['a travel buddy', 'weekend adventures', 'a climbing partner'],
    bio: 'Keeps a tide chart next to the calendar. Thinks a museum is a valid rainy-day plan.'
  },
  {
    id: 'jules-okeke',
    name: 'Jules Okeke',
    age: 32,
    city: 'Berkeley',
    energy: 'social',
    hobbies: ['dancing', 'soccer', 'cooking'],
    lookingFor: ['a dance partner', 'someone local', 'slow dinners'],
    bio: 'Tuesday pickup, Thursday salsa, Friday leftover rice. The schedule is the personality.'
  },
  {
    id: 'rafi-pell',
    name: 'Rafi Pell',
    age: 30,
    city: 'Oakland',
    energy: 'calm',
    hobbies: ['bouldering', 'sci-fi', 'woodworking'],
    lookingFor: ['a climbing partner', 'co-working company', 'quiet mornings'],
    bio: 'Builds shelves, then reads in front of them. Projects last exactly one weekend too long.'
  },
  {
    id: 'sable-ito',
    name: 'Sable Ito',
    age: 33,
    city: 'San Francisco',
    energy: 'social',
    hobbies: ['dancing', 'poetry', 'film photography'],
    lookingFor: ['a dance partner', 'quiet mornings', 'someone local'],
    bio: 'Writes on the train and edits on the walk. Claims the fog is a collaborator.'
  },
  {
    id: 'kenji-moss',
    name: 'Kenji Moss',
    age: 35,
    city: 'Oakland',
    energy: 'adventurous',
    hobbies: ['woodworking', 'cycling', 'trail running'],
    lookingFor: ['weekend adventures', 'long walks', 'someone local'],
    bio: 'Makes cutting boards and then takes them on picnics. Knows every fire road that still exists.'
  },
  {
    id: 'imani-ruiz',
    name: 'Imani Ruiz',
    age: 26,
    city: 'Berkeley',
    energy: 'social',
    hobbies: ['soccer', 'board games', 'language exchange'],
    lookingFor: ['someone local', 'co-working company', 'slow dinners'],
    bio: 'Always one player short of a scrimmage. Brings extra snacks as a personality.'
  },
  {
    id: 'pavel-strom',
    name: 'Pavel Strom',
    age: 38,
    city: 'San Francisco',
    energy: 'calm',
    hobbies: ['jazz', 'museums', 'pottery'],
    lookingFor: ['quiet mornings', 'slow dinners', 'someone local'],
    bio: 'Goes to matinees on purpose. Owns one good pan and will tell you which one.'
  },
  {
    id: 'yara-quinn',
    name: 'Yara Quinn',
    age: 29,
    city: 'Oakland',
    energy: 'social',
    hobbies: ['cooking', 'fermentation', 'house shows'],
    lookingFor: ['slow dinners', 'a bandmate', 'weekend adventures'],
    bio: 'Pickles things that did not ask to be pickled. Knows which warehouses still have a PA.'
  },
  {
    id: 'ellis-cho',
    name: 'Ellis Cho',
    age: 31,
    city: 'Berkeley',
    energy: 'adventurous',
    hobbies: ['trail running', 'birding', 'cycling'],
    lookingFor: ['long walks', 'weekend adventures', 'someone local'],
    bio: 'Stops mid-run for a hawk and will not apologize. Keeps a paper map in the vest.'
  },
  {
    id: 'noor-hale',
    name: 'Noor Hale',
    age: 34,
    city: 'San Francisco',
    energy: 'calm',
    hobbies: ['pottery', 'film photography', 'museums'],
    lookingFor: ['quiet mornings', 'a travel buddy', 'someone local'],
    bio: 'Throws bowls, then photographs the bowls, then gives the bowls away. Repeat.'
  }
]
