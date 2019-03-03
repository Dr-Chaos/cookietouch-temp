# CookieTouch API Documentation

[Sommaire](SUMMARY.md) | [Sommaire détaillé](singlepage.md)

quests.isOngoing(questID: number) : boolean
quests.isCompleted(questID : number) : boolean
quests.currentStep(questID: number) : Promise<number | null>
quests.objectivesNeeded(questID: number) : Promise<number[] | null>
quests.needObjective(questID: number, objectiveID: number) : Promise<boolean | null>

<hr>

## Sommaire

- [Quests](#quests)
  - [isOngoing](#isongoing)
  - [isCompleted](#iscompleted)
  - [currentStep](#currentstep)
  - [objectivesNeeded](#objectivesneeded)
  - [needObjective](#needobjective)

# Quêtes

Fonctions relatives aux quêtes

TODO
