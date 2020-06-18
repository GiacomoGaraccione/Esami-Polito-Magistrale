# Esercizi Esame

## Context Diagram

### 12/02/2019

|       Actor        | Physical Interface  |    Logical Interface     |
| :----------------: | :-----------------: | :----------------------: |
|      Customer      |    Smartphone/PC    |           GUI            |
|                    |      RFID/NFC       |                          |
|      Employee      |    Smartphone/PC    |           GUI            |
|                    |      RFID/NFC       |                          |
|       Admin        |         PC          |           GUI            |
| Credit Card System | Internet Connection |   Transaction Protocol   |
|   Card Producer    | Internet Connection | Card Production Protocol |


```plantuml
@startuml
actor Customer as c
actor Admin as a
actor Employee as e
actor "Credit Card System" as ccs
actor "Card Producer" as cp

c -- (FITFIT)
a --|> e
e -- (FITFIT)
ccs -- (FITFIT)
cp -- (FITFIT)


@enduml
```

### 17/09/2018

|      Actor       | Physical Interface | Logical Interface |
| :--------------: | :----------------: | :---------------: |
|     Athlete      |   PC/Smartphone    |        GUI        |
|      Admin       |         PC         |        GUI        |
| Racing committee |   PC/Smartphone    |        GUI        |
|    Supporter     |   PC/Smartphone    |        GUI        |

```plantuml
@startuml

actor Athlete as a
actor Admin as ad
actor "Racing Committee" as rc
actor Supporter as s

a -- (Bike Race Application)
ad -- (Bike Race Application)
rc -- (Bike Race Application)
s -- (Bike Race Application)


@enduml
```

### 2/10/2017

|        Actor         | Physical Interface | Logical Interface |
| :------------------: | :----------------: | :---------------: |
| Car owner volounteer |         PC         |        GUI        |
|   Admin company B    |         PC         |        GUI        |
|  Employee company B  |         PC         |        GUI        |

```plantuml
@startuml
actor Car_owner_volounteer as v
actor Admin_company_B as a
actor Employee_company_B as e

(Phantom_testing_software) as s

v -- s
a -- e
e -- s
@enduml
```

### 27/06/16

|     Actor      | Physical Interface  | Logical Interface |
| :------------: | :-----------------: | :---------------: |
|      User      |   Smartphone, PC    |        GUI        |
|     Admin      |         PC          |        GUI        |
| Payment System | Internet Connection |  SSL, HTTPS, API  |

```plantuml
@startuml
left to right direction
actor User as u
actor PaymentSystem as ps
actor Admin as a

a -- (Bike Service)

u -- (Bike Service)
ps -- (Bike Service)
@enduml
```
Admin potrebbe estendere User, ma non c'è modo di saperlo (no correzione)

### 07/09/15

|    Actor    |   Physical Interface    |            Logical Interface            |
| :---------: | :---------------------: | :-------------------------------------: |
|    User     |     Buttons, screen     |              Screen shots               |
| Rain Sensor | Bipolar Connector 0-3 V | Boolean (open = rain, closed = no rain) |

```plantuml
@startuml
left to right direction
actor User as u
actor "Rain Sensor" as rs

u -- (Watering Controller)
rs -- (Watering Controller)
@enduml
```


## Glossary (UML Diagram)

### 12/02/2019

```plantuml
@startuml
class "Customer" as c{
    + accessStartDate
    + accessEndDate
    + accessRight
}

class "Admin" as a

class "Employee" as e

class "Person" as p {
    + name
    + surname
    + address
    + email
}

class "FITFIT" as FF

class "Facility" as f{
    + address
    + id
}

class "Medical Cerificate" as mc {
    + expirationDate
    + writingDate
}

class "Smartphone" as s{
    + id
}

class "RFID Card" as rfid{
    + id
}

class "Payment" as pay{
    + date
    + amount
}


FF -- "*" p
p -- "0...1" s
p -- "0...1" rfid
c -- "*" pay
a -up-|> e
e -up-|> p
c -up-|> p
FF -- "*" f
c -- "mc"


@enduml
```

### 17/09/2018
```plantuml
@startuml

class "Athlete" as a {
    + name
    + surname
    + birthdate
    + raceNumber
}

class "Stage" as s {
    + number
    + day
    + startLocation
    + endLocation
    + lenght
    + maxDuration
}

class "Stage Ranking" as sr {
    + time
    + final: boolean
}

class "Race Ranking" as rr {
    + time
    + final: boolean
}

class "Result" as res {
    + startTime
    + endTime
    + disqualified: boolean
    + penalty
}

class "Bike Race" as br

a -- "*" sr
a -- "*" rr
s -up- "*" br
a "*" -right- "*" s
a "*" -- "*" br
br -- "*" rr
(a, s) .. res

@enduml
```

### 2/10/2017
```plantuml
@startuml
class CompanyB{
    name
}

class CompanyA{
    name
}

class Employee{
    name
    id
}

class PhantomTest{
    id
    dateBeginning
    dateEnd
}

class Volunteer{
    name
    id
}
class Car
class DefectType
class Workshop{
    id
}
class ServiceEvaluation{
    speed
    courtesy
    cleanliness
    price
}

CompanyB -- "*" Employee

Volunteer -- "*" Car

PhantomTest -- CompanyB
PhantomTest -- CompanyA
PhantomTest -- "*" Volunteer

Car -- DefectType
Car "*" -- Workshop

ServiceEvaluation "*" -- Volunteer
ServiceEvaluation -- Workshop

CompanyA -- "*" Car
@enduml
```

## Use Case Diagram

### 12/02/2019

```plantuml
@startuml


actor Customer as c
actor Employee as e
actor "Credit Card System" as ccs
actor Admin as a

c -up-> (Manage Medical Certificate)
(Manage Medical Certificate) -right-> (Check Validity) :includes
(Manage Medical Certificate) -right-> (Upload Certificate) :includes
c -right-> (Manage Subscription)
e -right-> (Manage Subscription)
(Manage Subscription) -> (Manage Payment): includes
(Manage Subscription) -> (Request Card): includes
(Manage Subscription) -down-> (Attach to Card or Smartphone): includes
ccs --> (Manage Payment)
a --> (Manage Accounts and Rights)
e --> (Manage Access)
(Manage Access) --> (Manage Entrance): includes
(Manage Access) --> (Manage Exit): includes

@enduml
```

### 17/09/2018
```plantuml
@startuml

actor Athlete as a
actor "Race Committee" as rc
actor Supporter as s

a --> (Subscribe to Race)
a --> (Retire from Race)
s --> (View Rankings)
rc --> (Manage Race)
(Manage Race) --> (Define Penalties):includes
(Manage Race) --> (Choose Race and Stages):includes
(Manage Race) --> (Enter Stage Times for all Athletes):includes
(Manage Race) --> (Validate and Publish Rankings):includes
a --> s
rc --> s


@enduml
```

## Requirements (FR, NFR)

### 12/02/2019

List of important NON Functional Requirements

|  ID   |                                          Description                                          |
| :---: | :-------------------------------------------------------------------------------------------: |
|   1   |  Privacy: a customer should know only his/her information and not the one of other customers  |
|   2   | Usability: customers should be able to understand how the app works in no more than 5 minutes |
|   3   |          Performance: response time of all functions offered is always < 0,5 seconds          |

### 17/09/2018
List of important NON Functional Requirements

|  ID   |                                            Description                                            |
| :---: | :-----------------------------------------------------------------------------------------------: |
|   1   |          Security: athletes and supporters should not be able to modify any kind of data          |
|   2   | Usability: average users should be able to understand how the app works in no more than 5 minutes |
|   3   |            Performance: response time of all functions offered is always < 0,5 seconds            |


## System Design

Solo entità fisiche (computer, connessioni, altri strumenti informatici)

### 12/02/2019

```plantuml
@startuml

class "FITFIT" as FF
class "Turnstile" as t
class "RFID Reader" as rfid
class "NFC Reader" as nfc

FF -- "*" t
t -- rfid
t -- nfc

@enduml
```

### 27/06/16

```plantuml
@startuml

class "Bike Sharing Server" as bss
class "Parking Spot Computer" as psc
class "Stand Computer" as sc
class "RFID Reader" as rr
class "Bicycle Lock/Unlock Device" as blud
class "Bicycle Interface" as bi

bss -- psc : "internet connection"
psc -- "*" sc : "wired connection"
sc -- rr
sc -- blud
sc -- bi


@enduml
```

### 07/09/15

```plantuml
@startuml

class "Watering Controller" as wc
class "Water Valve" as wv
class "Battery" as b
class "LCD Screen" as ls
class "Button" as bu

wc -- "2" wv
wc -- b
wc -- ls
wc -- "*" bu



@enduml
```

## Scenarios

### 17/09/2018
Scenario specific to an employee of the organization who enters start time for a stage for an athlete

Precondition: athlete A is enrolled in bike race BR, has started running in stage S.
Postcondition: start time for A in S is inserted in the system
| Step Number |                            Description                            |
| :---------: | :---------------------------------------------------------------: |
|      1      |                Employee E accesses the application                |
|      2      | E goes to S's page for BR, listing all athletes taking part in it |
|      3      |       E inserts in the list A's name and his/her start time       |
|      4      |                     E submits the information                     |

## Black Box Testing

Valid/Invalid dipende dai valori in input, si ha NV se anche solo uno dei valori non è accettabile
Se la funzione da testare prevede calcoli con i parametri in base ai quali decide il risultato e i parametri sono tutti validi

### 12/02/2019

|      g1      |      g2      |      g3      |      g4      |      g5      |      g6      | Valid/Invalid |            Test Case            |
| :----------: | :----------: | :----------: | :----------: | :----------: | :----------: | :-----------: | :-----------------------------: |
| [minint, 17] | [minint, 17] | [minint, 17] | [minint, 17] | [minint, 17] | [minint, 17] |      NV       |                                 |
|    tropo     |     che      |      le      |    faccio    |    tutte     |              |               |                                 |
|   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |       V       |  (18, 18, 18, 18, 18, 18) = 18  |
|   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |       V       |  (30, 30, 30, 30, 30, 30) = 30  |
|   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |       V       | (18, 22, 27, 19, 26, 30) = 23,5 |
|   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |       V       | (18, 18, 22, 27, 19, 26) = 21,5 |
|   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |       V       |  (30, 30, 24, 26, 22, 28) = 27  |
|   [31, 32]   |   [31, 32]   |   [31, 32]   |   [31, 32]   |   [31, 32]   |   [31, 32]   |      NV       |                                 |
|    tropo     |     che      |      le      |    faccio    |    tutte     |   parte 2    |               |                                 |
|   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |   [18, 30]   |    [ 33]     |       V       |  (33, 30, 24, 26, 22, 28) = 27  |
|    tropo     |     che      |      le      |    faccio    |    tutte     |   parte 3    |  zero sbatti  |                                 |



### 17/09/2018

|  Winner Time   |   Avg Speed    | Track Type  | Valid/Invalid |        Test Case         |
| :------------: | :------------: | :---------: | :-----------: | :----------------------: |
| [mindouble, 0] |      any       |     any     |      NV       |     (-5, 33, B) = 0      |
|                |                |             |               |      (0, 26, A) = 0      |
|      any       | [mindouble, 0] |     any     |      NV       |     (10, -4, C) = 0      |
|                |                |             |               |      (8, 0, C) = 0       |
|      any       |      any       | ! {A, B, C} |      NV       |     (10, 20, e) = 0      |
| (0, maxdouble] |    (0, 30]     |      A      |       V       |    (50, 27, A) = 52.5    |
|                |                |             |       V       | (0.001, 27, A) = 0.00105 |
|                |                |             |       V       |  (50, 0.001, A) = 52.5   |
|                |                |             |       V       |    (50, 30, A) = 52.5    |
|                |                |      B      |       V       |     (40, 27, B) = 48     |
|                |                |             |       V       |         continua         |
|                |                |             |               |                          |
|                |                |             |               |                          |
|                |                |             |               |                          |
|                |                |             |               |                          |
|                |                |             |               |                          |
|                |                |             |               |                          |
|                |                |             |               |                          |



### 18/07/16

|  nLuggage   |   length1   | width1 | depth1 | weight1 | length2 | width2 | depth2 | weight2 | totalDim1 | totalDim2 | totalWeight | Valid/Invalid |      Test Case       |
| :---------: | :---------: | :----: | :----: | :-----: | :-----: | :----: | :----: | :-----: | :-------: | :-------: | :---------: | :-----------: | :------------------: |
| [minint, 0[ |      -      |   -    |   -    |    -    |    -    |   -    |   -    |    -    |     -     |     -     |      -      |      NV       | (-1,0,0,0,0,0,0,0,0) |
|      0      |      -      |   -    |   -    |    -    |    -    |   -    |   -    |    -    |     -     |     -     |      -      |       V       | (0,0,0,0,0,0,0,0,0)  |
|      1      | [minint, 0] |   -    |   -    |    -    |    -    |   -    |   -    |    -    |     -     |     -     |      -      |      NV       | (1,-1,0,0,0,0,0,0,0) |
|      "      | [1, maxint] |        |        |         |         |        |        |         |           |           |             |               |                      |
E poi continua ma non sono un pazzo

### 27/06/16

|   duration   |   minRate   |  minRate2   | Valid/Invalid |      Test Case      |
| :----------: | :---------: | :---------: | :-----------: | :-----------------: |
| [minint, 0[  | [minint, 0[ | [minint, 0[ |      NV       |    (-1, -1, -1)     |
|              |             | [0, maxint] |      NV       |     (-1, -1, 5)     |
|              | [0, maxint] | [minint, 0[ |      NV       |     (-1, 5, -1)     |
|              |             | [0, maxint] |      NV       |     (-1, 5, 5)      |
|   [0, 30]    | [minint, 0[ | [minint, 0[ |      NV       |    (10, -1, -1)     |
|              |             | [0, maxint] |      NV       |     (10, -1, 5)     |
|              | [0, maxint] | [minint, 0[ |      NV       |    (10, 10, -1)     |
|              |             | [0, maxint] |       V       |  (10, 5, 3)  = 0.0  |
|              |             |             |               |  (0, 5, 3)  = 0.0   |
|              |             |             |               |  (1, 5, 3)  = 0.0   |
|              |             |             |               |  (30, 5, 3)  = 0.0  |
|   [31, 90]   | [minint, 0[ | [minint, 0[ |      NV       |    (31, -1, -1)     |
|              |             | [0, maxint] |      NV       |    (31, -1, 10)     |
|              | [0, maxint] | [minint, 0[ |      NV       |    (31, 5, -10)     |
|              |             | [0, maxint] |       V       | (31, 10, 10) = 0.1  |
|              |             |             |               | (40, 10, 10) = 1.0  |
|              |             |             |               | (90, 10, 10) = 6.0  |
| [91, maxint] | [minint, 0[ | [minint, 0[ |      NV       |    (91, -1, -1)     |
|              |             | [0, maxint] |      NV       |    (91, -1, 10)     |
|              | [0, maxint] | [minint, 0[ |      NV       |    (91, 10, -1)     |
|              |             | [0, maxint] |       V       | (91, 10, 10) = 6.1  |
|              |             |             |               | (100, 10, 10) = 8.0 |
|              |             |             |               | (100, 0, 10) = 1.0  |
|              |             |             |               | (100, 10, 0) = 6.0  |


### 07/09/15

|    side1    |    side2    |    side3    | triangle? | equal sides | position of equals | Valid/Invalid |   Test Cases   |
| :---------: | :---------: | :---------: | :-------: | :---------: | :----------------: | :-----------: | :------------: |
| [minint, 0] | [minint, 0] | [minint, 0] |     -     |      -      |         -          |      NV       |  (-1, -1, -1)  |
|             |             | [1, maxint] |     -     |      -      |         -          |      NV       |  (-1, -1, 2)   |
|             | [1, maxint] | [minint, 0] |     -     |      -      |         -          |      NV       |  (-1, 2, -1)   |
|             |             | [1, maxint] |     -     |      -      |         -          |      NV       |   (-1, 2, 2)   |
| [1, maxint] | [minint, 0] | [minint, 0] |     -     |      -      |         -          |      NV       |  (1, -1, -1)   |
|             |             | [1, maxint] |     -     |      -      |         -          |      NV       |   (1, -1, 3)   |
|             | [1, maxint] | [minint, 0] |     -     |      -      |         -          |      NV       |   (1, 2, -1)   |
|             |             | [1, maxint] |     F     |      -      |         -          |       V       | (1, 1, 2) = -1 |
|             |             |             |     T     |      0      |         -          |       V       | (3, 4, 5) = 3  |
|             |             |             |     T     |      3      |        AAA         |       V       | (1, 1, 1) = 1  |
|             |             |             |     T     |      2      |        AAB         |       V       | (1, 1, 3) = 2  |
|             |             |             |     T     |      2      |        ABA         |       V       | (1, 3, 1) = 2  |
|             |             |             |     T     |      2      |        BAA         |       V       | (3, 1, 1) = 2  |






## White Box Testing

### 18/07/16

Come minchia si decide la Path coverage?

|   Coverage Type    | Test Cases Needed for 100% Coverage | Coverage Obtained with defined TCs |           Test Cases Defined            |
| :----------------: | :---------------------------------: | :--------------------------------: | :-------------------------------------: |
|        Node        |                  2                  |                100%                |                TC1, TC2                 |
|        Edge        |                  2                  |                100%                |                TC1, TC2                 |
| Multiple Condition |                  4                  |                100%                |                TC1 (TT)                 |
|                    |                                     |                                    |                 TC2(FF)                 |
|                    |                                     |                                    |                 TC3(TF)                 |
|                    |                                     |                                    |                 TC4(FT)                 |
|        Loop        |                  3                  |                100%                | TC1(1 loop), TC2(no loop), TC3(2 loops) |
|        Path        |                                     |                                    |                                         |

TC1 = (-4, -1, -5);
TC2 = (3, 0, 3);
TC3 = (-3, -2, -1);
TC4 = (1, 0, 0);

### 27/06/16

|   Coverage Type    |              Test Cases Needed for 100% Coverage              | Coverage Obtained with defined TCs | Test Cases Defined |
| :----------------: | :-----------------------------------------------------------: | :--------------------------------: | :----------------: |
|        Node        |                               1                               |                100%                |        TC1         |
|        Edge        |                               1                               |                100%                |        TC1         |
| Multiple Condition | Not possible (one condition doesn't depend on input values)NO |                100%                |      TC1 (TF)      |
|                    |                               2                               |                                    |      TC2(TT)       |
|                    |                                                               |                                    |   TC1 iter7(FF)    |
|                    |                                                               |                                    |   TC1 iter7(FT)    |
|        Loop        |                               3                               |   33% can't force one/zero iters   |    TC1 6 times     |
|        Path        |                 4^6 = 2^12 <= 4096 if g6 < 34                 |                                    |                    |

TC1 = (18, 20, 19, 18, 20, 19);
TC2 = (18, 27, 30, 21, 29, 36);

### 07/09/15

|   Coverage Type    |  Test Cases Needed for 100% Coverage  | Coverage Obtained with defined TCs |       Test Cases Defined        |
| :----------------: | :-----------------------------------: | :--------------------------------: | :-----------------------------: |
|        Node        |                   3                   |                100%                |          TC1, TC2, TC3          |
|        Edge        |                   4                   |                100%                |       TC1, TC2, TC3, TC4        |
| Multiple Condition |  Not Feasible (no multiple cons) ERR  |                                    |                                 |
|                    |             2 are enough              |                100%                |               TC1               |
|                    |                                       |                                    |                                 |
|                    |                                       |                                    |                                 |
|        Loop        |                   3                   |  33% (can't force one/zero iters)  | TC1 3 times (any input is fine) |
|        Path        | 2^3 *4 = 32     ERR (overall 4 paths) |                                    |                                 |

TC1(10000)
TC2(20000)
TC3(40000)
TC4(1000)

### 12/02/2019

E' lo stesso identico caso del 07/09/15

### 17/09/2018

|   Coverage Type    | Test Cases Needed for 100% Coverage | Coverage Obtained with defined TCs |    Test Cases Defined    |
| :----------------: | :---------------------------------: | :--------------------------------: | :----------------------: |
|        Node        |                  1                  |                100%                |           TC1            |
|        Edge        |                  2                  |                100%                |         TC1, TC2         |
| Multiple Condition |                  4                  |                100%                |         TC1 (TF)         |
|                    |                                     |                                    |         TC2 (FF)         |
|                    |                                     |                                    |         TC3(FT)          |
|                    |                                     |                                    |         TC4(TT)          |
|        Loop        |                  3                  |                                    | TC1(1), TC3(> 1), TC5(0) |
|        Path        |      2^num_penalties * 2 * 2^3      |                                    |                          |

TC1({20, 20, 20}, {10, 10, 10}, 1, 110)
TC2({10, 10, 10}, {10, 10, 10}, 1, 10)
TC3({20, 20, 20}, {10, 10, 10}, 6, {5, 5, 5, 5, 5, 5})
TC4({20, 20, 20}, {10, 10, 10}, 6, {20, 20, 20, 20, 20, 20})
TC5({10, 10, 10}, {10, 10, 10}, 0, {})

### 02/10/2017

| Coverage type | Coverage obtained | Tests |
|--|--|--|
|Node|100%|T1|
|Edge|100%|T2, T1|
|Multiple condition|75%|T1, T2|
|Loop|66%|T1, T3|
|Path|100%, only 3 possible paths in total|T1, T2, T3|

T1(12)

T2(-1)

T3(1)

## Note di Teoria Varie

- Differences between iterable and waterfall process? Waterfall only performs one iteration.
- Singleton Design pattern? A class represents a concept that requires a single instance. Only one instance of the class is created.
- Types of defects in a requirements document? Omissions/incompleteness, incorrect facts, inconsistency/contradictions, ambiguity, extraneous information, overspecification in design, redundancy.
- What is an oracle, with its key problems? Given a test case, produces the expected output. Very difficult to have an automatic one, a human oracle is subject to errors; it's based on the program specifications, which can be wrong.
- Exhaustive testing? Trying all possible test cases for a function/class/program. Is normally unfeasible because of the virtually infinite test cases.
- Mutation testing? Evaluating how a test suite is good by injecting errors (mutations) in a program and verifying how many mutations are caught by the test suite.
- Copy - Modify - Merge approach, with pros and cons? Each user creates a working copy of a file. Users work in parallel, modifying their private copies and merging them. Users don't have to wait for one another to work on a file, but there's risk of conflicts arising if they both work on the same part of a file, and conflicts can't be resolved by software but require human intervention.
- Selecting one design according to Functional Requirements? If all designs satisfy Functional Requirements, decision should be based on satisfaction of NON Functional Requirements.
- Key concepts of Scrum? Having a product backlog(list of ordered requirements), working on increments(doing sprints of development, results must be usable), having different planning meetings(daily, sprint planning, sprint review)
- What factors characterize a software process? Number of interactions, sequential vs parallel activities, new development vs maintenance, emphasis on documents.
- What techniques can be used to validate the functional requirements of an application to be built? Inspection of requirements, prototype building, GUI prototype building, writing of acceptance test cases.
- Purpose of "check in" and "check out" operations in Configuration Management? Enforce sequential changes to Configuration Items(if in lock-modify-unlock mode) or support parallel changes(if in copy-modify-merge mode) to avoid inconsistencies.
- Pair programming technique in Xtreme Programming? Two people work on one machine to develop both production code and test cases with one person writing and the other suggesting changes/improvements (roles are often reversed).
- What are the factors to consider in selecting a suitable software process? Criticality(safety critical, mission critical, other), size(correlates to number of developers needed), domain, maintenance vs new development
- What is the difference between ‘correctness’ and ‘reliability’? Correctness is when a program produces the requested output for every input in the input space, reliability is the probability of providing the requested output over a period of time.
- How is versioning implemented in Subversion? All Configuration Items in a configuration inherit version number(which increments by 1) from the configuration.
- Repository architectural style, when can it be used? Subsystems must exchange data, either with shared data in a central database/repository which may be accessed by all subsystems or with each subsystem with its own database, passing data explicitly to other subsystems. It is best used when large amounts of data are to be shared.
- What are the typical states of a Change Request in a maintenance process? Receive Change Requests, filter them(merge similar ones, discard incorrect/unfeasible ones), evaluate impact of Change Requests, rank them(using severity for corrective ones and importance for evolutive ones), assign Change Requests to person/team that will implement them, merge CR with next release of application, release application.
- What is the basic principle of the Visual approach to GUI testing? Graphic components (buttons, menus etc) are recognized via image recognition.
- What is the basic principle of the layout-based scripted approach to GUI testing? Graphic components are identified retrieving their ID(used by the graphic library) or by specific unique properties. 
- Pipeline architectural style, when can it be used? Many modules are connected in sequence, with each module being independent of others and data flowing from one module to the next one as the only way of communication between modules. Used when there's need to process data streams according to several steps.
- In which cases can an Oracle be automatic? If a previous, reliable version of the software application is available or if a function can be expressed mathematically.
- What is the derivation history of a Configuration Item? The history of versions and the changes made in them for the specific CI.
- What is the core content of the ISO 12207 standard? Hierarchical List of activities in the software process.
- What is more relevant for a user between a defect and a failure in a software application? A failure, because the user is exposed to it.
- Problem of interactions in Non Functional Requirements? Some NFR may be in conflict (performance vs security), so it is unfeasible to achieve both and trade-offs are required.
- What are the risks of not using Configuration Management? Concurrent access and inconsistent modifications of CIs, unavailability of past versions of CIs.
- Abstract Factory design style, when can it be used? Can be used when a family of related classes can have different implementation details and the client shouldn't know anything about which variant they're using.
- Weinberg’s law? The creator of a program is unsuitable to test it since because of emotional attachment to its creature the programmer tends to overlook defects in it. 
- Lock - Modify - Unlock approach, with pros and cons? The repository allows only one person at a time to work on a file, with a lock operation needed to work on a file and preventing others to work on it until the release of the lock. May cause delays (locks being kept for a long time, changes that don't overlap can't be done in parallel) and problems of compatibility if two files need to work together and changes ruin this functionality.
- What is a baseline and when is it used? A baseline is a set of Configuration Items in a stable form(compiles correctly, links, passes all regression tests); it's used to deliver an application internally/externally while development continues on the next version.
- Waterfall process, with pros and cons? Document oriented process where activities(requirement/design/implementation/unit test/intergration test/system test) are done in sequence (activity i+1 starts only after activity i is completed). Easy structure of activities and agreement on design allows to allocate tasks to many, distributed workers/companies but delivery to customer and validation of requirements/system happen very late, changes require to restart the process and there's slowness and lack of flexibility.
- What is versioning?  Keeping copy of each instance of a Configuration Item, allowing to keep the history of all modifications to a CI, and the ability to roll back to any past instance of a CI
- What measures can be used to evaluate the quality of software? Fault density, Mean Time Between Failures, user satisfaction (questionnaire).
- Adapter design pattern? A class provides the required features but its interface is not the one required.
- Considering GIT, what are the three project sections that it defines, and how are they used? Git directory(collection of all committed and pushed files, accessible by all users), working directory(cloned directory where users work and implement modifications) and staging area (contains modified files committed but not yet pushed).
- Test Driven Development technique? Write, using requirements, one test case that fails, then write corresponding code until test case passes, repeat until all requirements are satisfied and all test cases pass.
- What are the units of measure for Duration and Effort? Duration is measured in calendar time(hours, days, weeks) and consists in the time needed to complete a project, while effort is measured in Person*hours and is the amount of work needed.
- Facade Design pattern? A functionality is provided by a complex group of classes, allows to use the classes without being exposed to their details.
- MVC Design pattern? When there's an interactive application with flexible Human Computer Interaction where the same information is presented in different ways and must be consistent, uses a Model to manage state, a View to render on the UI and a Controller to handle events from the UI.
- Key steps in an inspection process of a requirement document? Reading document done by a group of people with the goal of finding (not correcting) defects, which are then communicated to those that wrote the document.
- Delphi estimation method? Structured meetings to achieve consensus in estimate where each participant proposes anonymously an estimate and the team leader then publishes a synthesis of all the estimates. This process is then repeated in an iterative way.
- What is a 'deliverable' (project management)? A product inside the project, can be final or intermediate, internal(for the producer) or external(for the customer).
- Layered architectural style? The system is organised into a set of layers, each of which provides a set of services. Each layer can only use the services of its adjacent layers.
- What is a 'milestone' (project management)? A key event or condition in the project which has effects on subsequent activities.
- What is 'slack time' (project management)? The admissible delay to complete an activity. //definizioni di una riga trovate in una pagina
- What is 'late start' (project management)? The latest time an activity can be started without changing the end time of the project.
- Perspective based inspection technique? Readers read the requirements document using different points of view (end user, tester, developer)
- Mixed Revisions in Subversion? Revisions of a working copy whose files have different revision numbers, they are only possible in the working copy and not in the central repository.
- Testing top-down when function A calls function B that calls function C? Test A using a stub for B, then test A+B using a stub for C, then test A+B+C.
- Testing bottom-up when function A calls function B that calls function C? Test C, then test B+C, then test A+B+C.
- Adams's Law? It's not feasible to not inject defects in software, the probability of inserting a defect when writing or changing code is different from zero.
- What are the most important functions of a configuration management tool? Identify and manage parts of software, handle whole history of repositories, handle branches, configuations and versions of software, handle accesses and changes to parts.
- The cost of fixing a defect in a requirements document is higher if the project is in the requirement phase, or if the project is in the coding phase? Fixing a defect in a requirements document costs less if it's done in the requirements phase, since there are no other artifacts existing at that time.
- What is a deadline? Calendar date when a task/deliverable has to be completed.
- Static analysis techniques? Inspection/dataflow analysis/control flow analysis.
- What are the key differences between testing and debugging? Testing tries to find failures, debug tries to discover the correspondent faults 
