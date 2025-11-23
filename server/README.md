# Angriffe durch Vscode Extensions

## Description
Diese Repository enthält die Implemntierung vier Proof
of Concept Angriffen durch vier Extensions. 


## Injizierung von Schadcode in Quellcode
Bei diesem Angriff werden C Quellcodes injiziert. In dem Ordner `code-injection` befindet sich das Extension.

## Diebstahl von Quellcode
Diese Angriff zielt darauf ab, Quellcode zu stehlen. Die Implementierung des Angriffs umfasst nicht nur den Quellcode, sondern das gesamte Projekt, zu dem der Quellcode gehört. In dem Ordner `diebstahl-von-quellcode` befindet sich das Extension.

## Austausch des kompilierten Programms
Bei diesem Angriff wird das kompilierte C Programm vertrauscht. In dem Ordner `austausch-des-kompilierten-programms` befindet sich das Extension.



## Prozess durch Erweiterung starten
Dieser Angriff dient dazu, einen Prozess unbemerkt zu starten. In dem Ordner `prozess-durch-erweiterung-starten ` befindet sich das Extension.

## Angriffe testen

## installtion als Vsix:
In der `Vsix` Ordner befindet sich für jede Erweiterung eine Vsix Datei. 


Um die Vsix Datei im Vscode zu installieren:
`Ctrl+Shift+X`->`...`->`Install from Vsix`

## Die Erweiterung direkt testen
`Ctrl+Shift+D`->`run "Angriffsname" `->`F5`



## Autor
Suleiman Odeh
