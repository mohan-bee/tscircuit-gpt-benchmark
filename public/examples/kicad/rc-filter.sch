EESchema Schematic File Version 4
LIBS:power
EELAYER 29 0
EELAYER END
$Descr A4 11693 8268
Sheet 1 1
Title "RC Filter"
$EndDescr
$Comp
L Device:R R1
U 1 1 1
P 4700 3500
F 0 "R1" V 4493 3500 50  0000 C CNN
F 1 "1k" V 4584 3500 50  0000 C CNN
	1    4700 3500
	0    1    1    0
$EndComp
$Comp
L Device:C C1
U 1 1 2
P 5350 3950
F 0 "C1" H 5465 3996 50  0000 L CNN
F 1 "100nF" H 5465 3905 50  0000 L CNN
	1    5350 3950
	1    0    0    -1
$EndComp
Text Label 4250 3500 2    50   ~ 0
VIN
Text Label 5350 3500 0    50   ~ 0
VOUT
Wire Wire Line
	4250 3500 4550 3500
Wire Wire Line
	4850 3500 5350 3500
Wire Wire Line
	5350 3500 5350 3800
Wire Wire Line
	5350 4100 5350 4300
Text Label 5350 4300 0    50   ~ 0
GND
$EndSCHEMATC

