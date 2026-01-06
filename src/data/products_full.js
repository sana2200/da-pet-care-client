// Auto-generated products module parsed from pasted product table.
// This file contains a parser that reads a tab/newline-separated table
// (the original table was pasted into the user message) and exports
// `products` (array) and `categoryEmoji` (map). This avoids manually
// listing hundreds of product objects and keeps the source manageable.

const rawTable = `Product	#SN.	Image	Code	Name	Category	Sell	Stock
1		8850477018778	Smart heart Treats - 4*15g- Chicken	Food	230.00	24
2		8850477018785	Smart heart Treats - 4*15g- Tuna	Food	230.00	24
3		PDR.00504	Delivery Charge	Others	80.00	0
4		PDR.00503	Wall mount Catnip	Accessories	190.00	4
5		PDR.00502	Pet Toothbrush	Accessories	130.00	2
6		PDR.00501	INJ. MARBO-REN - 10ml	Medicine	350.00	5
7		PDR.00500	Susp. Delentin 50mg/ml	Medicine	16.00	2
8		PDR.00499	Inj. Fusid	Medicine	9.00	5
9		PDR.00498	Syp. Moxacil - 100ml	Medicine	70.00	19
10		PDR.00497	Inj. Mega C - 500mg/5ml	Medicine	6.00	70
11		PDR.00496	INJ. CYNOMIN - 10 ML	Medicine	32.00	6
12		P-DR.00495	INJ. Melocam vet 0.5g - 10ml	Medicine	60.00	17
13		8682631201142	Jungle Cat treat - Tuna & Salmon - 70g	Food	250.00	9
14		8682631201135	Jungle Cat treat - Chicken - 70g	Food	250.00	8
15		PDR.00492	E collar - Elizabeth Collar - Size 3	Accessories	350.00	3
16		PDR.00491	E collar - Elizabeth Collar - Size 1	Accessories	500.00	3
17		6970117120370	Bioline Catnip Invigorating - 20g	Food	280.00	7
18		PDR.00489	Alice Lotion -60g	Medicine	130.00	3
19		PDR.00488	Syp. Bicozin - 100 ml	Medicine	60.00	8
20		PDR.00487	Pow Erocot Vet 10g	Medicine	45.00	2
21		PDR.00486	Pow. Neoxel vet - 10g	Medicine	40.00	2
22		P-DR.00485	Inj. Renamox - 1G	Medicine	103.00	1
23		PDR.00484	Pet Hex Shampoo - 200ml	Medicine	980.00	0
24		PDR.00483	Cat grass jar	Food	380.00	0
25		PDR.00482	Rivalta Test	Service	300.00	-1
26		PDR.00481	Bell Only	Accessories	25.00	30
27		PDR.00480	Pow. Pronapen 40 Lac (Vet)	Medicine	65.00	5
28		6970117120202	Bioline Pet Dry Shampoo Powder - 100g	Accessories	590.00	5
29		8682631204310	Pet Bee's Cat Food - Chicken - 1KG	Food	500.00	0
30		PDR.00477	Oint. Dermupin - 15gm	Medicine	180.00	6
31		PDR.00476	Nasal Drop Solo	Medicine	25.00	16
32		PDR.00475	Syp. Alatrol Pediatric Drops	Medicine	28.00	13
33		8904285511058	Billi - Adult - Tuna - 1.5kg	Food	690.00	8
34		8904285511027	Billi - Kitten - Chicken - 1.5 kg	Food	690.00	19
35		8906074445254	Billi - Adult - Tuna - 500g	Food	270.00	20
36		8906074445278	Billi - Kitten - Tuna - 500g	Food	270.00	27
37		PDR.00470	L Favourite - 25L - Coffee	Accessories	1,350.00	1
38		PDR.00469	L Favourite - 25L - Lemon	Accessories	1,350.00	2
39		PDR.00468	L Favourite - 25L - Levender	Accessories	1,350.00	23
40		PDR.00467	DR. PETZ Ultivite Gel - 6gm	Medicine	60.00	25
41		PDR.00465	Syp. PA Zinc Plus - 100 ml	Medicine	95.00	5
42		8904285516572	Miow Miow kitten milk replacer - 150g	Food	570.00	3
43		6972577016347	Snowcat Cat Litter - 10L - Coffee	Accessories	600.00	22
44		6972577016347	Snowcat Cat Litter - 10L - Levender	Accessories	600.00	9
45		6972577016347	Snowcat Cat Litter - 10L - Lemon	Accessories	600.00	7
46		6972577016224	Snowcat Cat Litter - 5L - Coffee	Accessories	320.00	4
47		PDR.00459	C. Section with Spay surgery	Service	7,500.00	-6
48		PDR.00458	Susp. Flamyd - 200mg/5ml - 60 ml	Medicine	35.00	3
49		PDR.00457	Inj. Hepavita - 100 ml	Medicine	360.00	0
50		PDR.00456	Inhaler Flutide 125/5 HFA	Medicine	625.00	0
51		PDR.00455	Viodin 5% Ointment	Medicine	55.00	7
52		7870201379877	Fouzan Chicken Wetfood Can - 400g	Food	230.00	84
53		7830201379628	CattoGel Multivitamin Paste - 120g	Medicine	620.00	0
54		6972229788677	Haisenpet Creamy Cat Treat - Chicken	Food	230.00	14
55		6973373206109	Haisenpet Premium Adult Food-450g	Food	250.00	2
56		8694686406083	Bonacibo Premium-Kitten Chicken,Anc&Rice - 1.5kg	Food	990.00	14
57		PDR.00449	GU Sandy Cat Litter - Levender - 5L	Accessories	280.00	0
58		PDR.00448	GU Sandy Cat Litter - Lemon - 5L	Accessories	280.00	0
59		PDR.00447	GU Sandy Cat Litter - Apple - 5L	Accessories	280.00	0
60		PDR.00446	Cat dress -Stylish Regular	Accessories	280.00	2
61		PDR.00445	Cat Grass stick	Food	210.00	0
62		PDR.00444	Spring Toy	Accessories	90.00	12
63		PDR.00443	Paw Paw Adult Cat food - 7kg	Food	2,750.00	1
64		PDR.00442	Moxaclav Forte PFS - 50ml	Medicine	230.00	0
65		PDR.00441	Cuties Catz - Chicken & Tuna - 8 kg	Food	3,350.00	2
66		PDR.00440	Sol. Itracon Vet - 15ml	Medicine	100.00	3
67		P-DR.00439	Syp. Alkari / Alkuli - 100ml	Medicine	75.00	2
68		P-DR.00438	Emema	Service	1,500.00	-1
69		PDR.00437	Inj. PPI 40 IV	Medicine	90.00	17
70		8850477882850	Smart Heart Pouch - Sardin w Chicken & Rice	Food	90.00	26
71		8850477012653	Smart Heart Pouch -Chicken w Rice and Carrot - 85g	Food	90.00	17
72		8850477837072	Smart Heart - Chicken and Tuna - 7.0 kg	Food	3,400.00	2
73		8850477017115	Smart Heart - Chicken and Tuna - 10 kg	Food	4,600.00	7
74		8850125072978	Friskies Meaty Grills Dry Cat Food- 400g	Food	400.00	5
75		8850125072855	FRISKIES Kitten Discoveries Dry Cat Food - 400gm	Food	400.00	1
76		8850477007550	Cuties Catz Can - Tuna - 400G	Food	200.00	32
77		6927749871521	Wanpy Meat Paste- Duck & Pumpkin	Food	150.00	29
78		6927749871514	Wanpy Meat Paste- Chicken & Carrot	Food	150.00	9
79		8698995003544	Reflex Plus Adult Cat Food Salmon 1.5Kg	Food	1,250.00	0
80		8698995027182	Reflex Plus Adult Cat Food Choosy with Salmon 1.5K	Food	1,250.00	0
81		8698995003551	Reflex Plus Adult Cat Food Chicken-1.5kg	Food	1,250.00	0
82		8694686406090	Bonacibo Premium-Chicken With Anchovy & Rice-2KG	Food	1,250.00	0
83		8681889062116	Cango Adult Chiken Recipe- 1 KG	Food	490.00	0
84		8850477898509	Smart Heart - Tuna & Shrimp - 480 g	Food	360.00	0
85		6954016638839	Pet Toothpaste - 70g	Accessories	270.00	4
86		8857101750882	Petme Plus Gel - 100g	Medicine	1,000.00	12
87		PDR.00419	Inj. Barbit - 200mg/ml	Medicine	16.00	25
88		PDR.00418	Moxibac Eye drop	Medicine	160.00	0
89		PDR.00417	Toxoplasma kit test	Diagnostic Test	600.00	-3
90		PDR.00416	Captain Meow Litter - Lemon - 5L	Accessories	280.00	0
91		PDR.00415	Captain Meow Litter - Lavender - 5L	Accessories	280.00	0
92		PDR.00414	Captain Meow Litter - Coffee - 5L	Accessories	280.00	0
93		PDR.00413	Tab. Methsolon 4	Medicine	6.00	33
94		PDR.00412	Tab. Monas 10	Medicine	17.50	30
95		PDR.00411	Cap. Neugalin 50	Medicine	14.60	0
96		6927749871194	Wanpy Creamy Treat - Tuna - 70g	Food	230.00	16
97		6927749871217	Wanpy Creamy Treat - Chicken and Carb - 70g	Food	230.00	5
98		8720256113799	Truly Creamy Cat treat - Salmon & Cranberry- 70g	Food	230.00	1
99		8720256113751	Truly Grain Free Can - Chicken & Carb - 95g	Accessories	180.00	14
100		6972229783504	Haisenpet Extreme Lavender - 5L	Accessories	320.00	0
101		8904285510815	Billi - Kitten - Chicken - 500g	Food	270.00	58
102		P-DR.00404	Inj. Onaseron - 4 ml	Medicine	32.00	249
103		PDR.00403	T-Mycin Plus Eye drop - 5ml	Medicine	150.00	0
104		PDR.00402	T-Mycin Eye Drop - 5ml	Medicine	100.00	1
105		8850477890404	Smart Heart Can - Tuna in Jelly -400g	Food	230.00	32
106		8850477898158	Smart Heart - Tuna and Shrimp - 1.2kg	Food	790.00	0
107		8850477898356	Smart Heart - Tuna and Shrimp - 3kg	Food	1,650.00	0
108		8850477840508	Smart Heart - Sea Food - 480 g	Food	360.00	0
109		8850477895485	Smart Heart - Salmon - 480 g	Food	360.00	0
110		PDR.00396	Non listed Service  - Mox	Medicine	80.00	2
111		PDR.00395	Cat Carry Bag - Bagpack Ball Shaped	Accessories	1,450.00	7
112		PDR.00394	Vac Purevax-With checkup,Pushing,Card re/issue fee	Medicine	1,300.00	140
113		PDR.00393	Inj. Parasitin Vet - 10 ml	Medicine	118.00	5
114		PDR.00392	INJ. TPC	Medicine	25.00	1
115		PDR.00391	FHV Test	Diagnostic Test	8.00	20
116		PDR.00390	SYP. PA Cool Pet - 50ml	Medicine	90.00	10
117		PDR.00389	Syp. Ceevit - 100ml	Medicine	40.00	0
118		PDR.00388	Susp. Ciprocin - 60ml	Medicine	100.00	4
119		PDR.00387	Susp. Moxaclav- 100ml	Medicine	220.00	25
120		PDR.00386	Tab. Mucomist-DT - 600mg	Medicine	15.00	13
121		PDR.00385	Syp. Inolac - 100ml	Medicine	140.00	5
122		P-DR.00384	Inj. P-20 Vet	Medicine	150.00	7
123		P-DR.00383	Inj. Renamic Vet - 10ml	Medicine	50.00	16
124		P-DR.00382	Inj. Dexaren - 10ml	Medicine	35.00	14
125		P-DR.00378	Radium Collar Belt	Accessories	150.00	84
126		6972229780251	Haisenpet Cat litter - Coffee - 10L	Accessories	600.00	6
127		6972229780268	Haisenpet Cat litter - Lemon - 10L	Accessories	600.00	18
128		6972229780282	Haisenpet Cat litter - Levender - 10L	Accessories	600.00	27
129		8681692601915	Paw Paw kitten Can - Chicken	Food	190.00	12
130		8681692601908	Paw Paw Kitten Can - Fish	Food	190.00	17
131		6927749871538	Wanpy Meat Paste- Salmon,Chicken & Carrot	Food	150.00	16
132		6927749871545	Wanpy Meat Paste- Tuna,Chicken & Carrot	Food	150.00	37
133		8681299603626	Jungle Adult - Lamb - 1.5 kg	Accessories	840.00	2
134		P-DR.00368	Treasure toy - Palok	Accessories	120.00	26
135		PDR.00367	Rubber Chew Toy	Accessories	150.00	1
136		PDR.00366	Treasure toy	Accessories	120.00	8
137		PDR.00365	Inj. Oxyton DS	Medicine	26.00	10
138		PDR.00364	Inj. Moxin - 500mg	Medicine	55.00	6
139		P-DR.00363	Oral Paste Trialon	Medicine	100.00	1
140		P-DR.00362	Single Belt collar	Medicine	100.00	40
141		PDR.00361	Inj. Clindacin 600	Medicine	70.00	26
142		P-DR.00360	Tab. Tracid 500mg	Medicine	23.00	9
143		PDR.00359	Syp. Alanil - 50ml	Medicine	48.00	21
144		PDR.00358	Oint. Combo 4 - 15g	Medicine	150.00	9
145		8850477883857	Smart Heart Pouch Adult-Tuna with Chicken in Jelly	Food	90.00	145
146		8852021705622	Bellotta Adult Pouch - Tuna & Chicken - 85g	Food	90.00	0
147		PDR.00355	Neuter surgery (cryptorchid cat)	Service	4,000.00	-2
148		P-DR.00354	Pow. Nebanol - 10g	Medicine	25.00	12
149		P-DR.00353	Oral Paste Apsol	Medicine	80.00	9
150		P-DR.00352	E/E drop Gentabac - 5ml	Medicine	32.00	2
151		PDR.00351	Eye drop Gatiflox - 5ml	Medicine	125.00	5
152		PDR.00350	Mouse Ball	Accessories	100.00	0
153		PDR.00349	Inf. Normalin - 500ml	Medicine	67.00	32
154		PDR.00348	Inf. Electrosal  - 500 ml	Medicine	71.00	15
155		PDR.00346	Pow. Ectonil Vet  - 10g	Medicine	38.00	0
156		8857101750837	Petme Lyte - 15g	Medicine	140.00	4
157		6972229781180	Haisenpet cat litter -Lemon- 25L	Accessories	1,500.00	0
158		6972229781630	Haisenpet cat litter -Coffee-  25L	Accessories	1,500.00	2
159		6972229781579	Haisenpet cat litter -Levender- 25L	Accessories	1,500.00	14
160		6972229780367	Haisenpet cat litter -Lemon-  5L	Accessories	320.00	26
161		6972229780367	Haisenpet cat litter -Levender-  5L	Accessories	320.00	49
162		6972229780367	Haisenpet cat litter -Coffee-  5L	Accessories	320.00	24
163		6927749871125	Wanpy Creamy cat Treat tuna & Cod fish -70 g	Food	230.00	24
164		8720256113775	Truly Creamy Cat treat - Shrimp & Codfish- 70g	Food	230.00	9
165		8859483600014	Frontguard Plus Spot on	Medicine	380.00	24
166		PDR.00331	Susp. Pet Gasnil - 30ml	Medicine	95.00	7
167		PDR.00330	Tab. PA-Dr Petz Iromin	Medicine	30.00	77
168		PDR.00329	Sol. OTI-PURE	Accessories	1,350.00	0
169		P-DR.00328	Syp. Vitagrow -100ml	Medicine	80.00	8
170		P-DR.00327	Susp. Tridosil - 15ml	Medicine	85.00	14
171		P-DR.00326	Urine Pad / Pee pad	Accessories	70.00	45
172		P-DR.00325	Grooming Brush Large	Accessories	280.00	8
173		8681299602032	Jungle Adult- Salmon - 1.5 kg	Food	840.00	12
174		P-DR.00323	Litter box - M	Accessories	400.00	10
175		PDR.00322	Hormon Injection	Medicine	500.00	-11
176		PDR.00321	Butterfly Needle	Others	10.00	-420
177		PDR.00320	Saline pushing & Medicine Cost	Service	300.00	-343
178		PDR.00319	Saline Pushing & Prescribed Medicine cost	Service	500.00	-107
179		PDR.00318	Oxygen Supply (Per 10 Minutes)	Service	200.00	-25
180		PDR.00317	Follow up Consultancy	Service	400.00	-117
181		PDR.00316	Minor Surgery	Surgery	1,000.00	-12
182		PDR.00315	Consultancy - Rescue animal	Service	400.00	-17
183		PDR.00314	Others Service Cost	Service	50.00	-444
184		PDR.00313	Syringe - 1ml - JMI	Accessories	5.50	-96
185		PDR.00312	Syringe - 1ml - OSL	Medicine	4.50	-1318
186		PDR.00311	Syringe - 3ml - Incepta	Medicine	4.00	-105
187		PDR.00310	Syringe - 5ml - OSL	Medicine	5.00	-72
188		PDR.00309	Flushing -Follow up-Fixed catheterization	Surgery	800.00	-8
189		PDR.00308	Flushing -Follow up-Setup new catheterization	Surgery	1,000.00	-1
190		PDR.00307	Catheterization - Cat	Surgery	2,500.00	-10
191		PDR.00306	Medicated Bath	Service	1,000.00	-13
192		PDR.00305	Fur Trimming - Dog	Service	3,500.00	0
193		PDR.00304	Fur Trimming - Cat	Service	2,000.00	-32
194		PDR.00303	Ear Cleaning	Service	300.00	-69
195		PDR.00302	Nail trimming	Service	300.00	-122
196		PDR.00301	Rectal / Vaginal Prolapse Correction	Surgery	1,500.00	-3
197		PDR.00300	Enucleation Surgery	Surgery	3,000.00	0
198		PDR.00299	Hernia Surgery	Surgery	4,000.00	-1
199		PDR.00298	Amputation Surgery	Surgery	5,000.00	-2
200		PDR.00297	Enema	Service	1,500.00	-14
201		PDR.00296	Fracture Management - Cat	Service	3,500.00	-7
202		PDR.00295	Fracture Management - Dog	Service	5,000.00	0
203		PDR.00294	Pyometra Surgery - Cat	Surgery	4,500.00	-8
204		PDR.00293	Pyometra Surgery - Dog	Surgery	5,000.00	-1
205		PDR.00292	Tumor Surgery - Large Scale Zone	Surgery	5,000.00	-1
206		PDR.00291	Tumor Surgery - Average Zone	Surgery	2,500.00	-2
207		PDR.00290	Tumor Surgery - Tiny Zone	Surgery	1,500.00	0
208		PDR.00289	C section Surgery - Dog	Surgery	6,000.00	0
209		PDR.00288	C section Surgery - Cat	Surgery	5,000.00	-7
210		PDR.00287	Neuter surgery / Orchiectomy - Dog	Surgery	2,500.00	-2
211		PDR.00286	Neuter surgery / Orchiectomy - Cat	Surgery	1,800.00	-123
212		PDR.00285	Spay surgery / Ovariohysterectomy - Dog	Surgery	6,000.00	-1
213		PDR.00284	Spay surgery / Ovariohysterectomy - Cat	Surgery	3,000.00	-102
214		PDR.00283	Wood lamp skin test	Diagnostic Test	200.00	-16
215		PDR.00282	Biochemical tests - kidney function	Diagnostic Test	800.00	-9
216		PDR.00281	Biochemical tests - Liver function	Diagnostic Test	1,200.00	-7
217		PDR.00280	Microscopic Test	Diagnostic Test	200.00	-3
218		PDR.00279	Sedative / Anaesthesia	Service	200.00	-45
219		PDR.00278	General Wound Dressing - Large-Scale Zone	Service	800.00	-3
220		PDR.00277	General Wound Dressing - Moderate Area	Service	500.00	-18
221		PDR.00276	General Wound Dressing - Limited Region	Service	300.00	-42
222		PDR.00275	Maggot Wound Dressing - Large-Scale Zone	Service	2,000.00	-13
223		PDR.00274	Maggot Wound Dressing - Moderate Area	Service	1,500.00	-9
224		PDR.00273	Maggot Wound Dressing - Limited Region	Service	1,000.00	-4
225		PDR.00272	Home Call- Veterinarian	Service	1,500.00	-13
226		PDR.00271	Chemo	Service	800.00	0
227		PDR.00270	Medicine Cost (From Clinic)	Service	200.00	-177
228		PDR.00269	Follow Up Injection	Service	300.00	-7
229		PDR.00267	Nebulization	Service	300.00	0
230		PDR.00265	Deworming (Oral / Injectable) / Tick-Flea Inj	Service	300.00	-680
231		PDR.00264	Service Charge	Service	200.00	-201
232		PDR.00263	Vet Consultancy (Birds/Rabbit)	Service	500.00	-27
233		PDR.00259	Vet Consultancy (Dog/Cat)	Service	600.00	-979
234		6975954675229	Flea comb Large	Accessories	190.00	14
235		PDR.00257	Inj. GS	Medicine	1,650.00	11
236		PDR.00256	Inj. Vitabion	Medicine	28.00	31
237		PDR.00255	Jacket Herness - M	Accessories	210.00	0
238		PDR.00254	Jacket Herness - S	Accessories	210.00	7
239		PDR.00253	Feeder Premium	Accessories	220.00	2
240		PDR.00250	Cat treat - 70g	Food	50.00	568
241		PDR.00248	Syp. Famodin - 60ml	Medicine	50.00	0
242		PDR.00247	Saline Set	Medicine	40.00	9
243		PDR.00246	Atlas Cat / Pet Metro Cat Pouch	Food	100.00	0
244		5410340410615	Lara Adult - 10 kg	Food	5,000.00	0
245		8681299601882	Jungle Adult - Chicken and fish - 15KG	Food	7,300.00	0
246		8904235835081	Bengal Cat Carrier Jhuri	Accessories	430.00	16
247		8901138501235	Syp. Liv 52	Medicine	270.00	14
248		PDR.00236	Inj. Maroxacin Vet -10ml	Medicine	350.00	0
249		PDR.00235	Inj. Mel Vet - 10ml	Medicine	45.00	2
250		PDR.00234	Inj. Tracid Vet- 10ml	Medicine	50.00	0
251		PDR.00233	Inj. Steron Vet - 10ml	Medicine	35.00	4
252		PDR.00232	Inj. Asta Vet -10ml	Medicine	16.00	0
253		PDR.00231	Inj. Cidaflox vet -10ml	Medicine	35.00	7
254		PDR.00230	Inf. Normal Saline ( NS ) - 500ML	Medicine	67.00	0
255		PDR.00229	Inf. Dextrose 5% - 500ml	Medicine	71.00	22
256		PDR.00228	Inf. Glucosal 5% DNS - 500ML	Medicine	75.00	-1
257		PDR.00227	Inf. Hartmann Solution ( HS) - 500ML	Medicine	71.00	0
258		PDR.00221	Aminovit Plus vet Inj -20ml	Medicine	100.00	-2
259		PDR.00220	Eye drop Eyemox D - 5ml	Medicine	200.00	0
260		PDR.00219	E/E drop Cipro A - 5ml	Medicine	50.00	6
261		PDR.00218	Ear drop Otoxin - 10ml	Medicine	150.00	10
262		PDR.00217	E/E drop Civodex vet - 5ml	Medicine	80.00	0
263		PDR.00216	Susp. Orcalmin Pet Susp - 200ml	Medicine	360.00	20
264		PDR.00215	Syp. Pet Utkid - 200ml	Medicine	920.00	3
265		PDR.00213	Inf. Dirozyl IV - 100ml	Medicine	85.00	16
266		PDR.00212	Sol. Viodin Vet-10 - 100ml	Medicine	93.00	5
267		PDR.00211	Inj. Bipilin - 1g	Medicine	37.00	14
268		PDR.00210	Inj. Tracid	Medicine	65.00	10
269		PDR.00209	Inj. Periset - 4ml	Medicine	30.00	21
270		PDR.00208	Inj. Filin - 125ml/5ml	Medicine	5.00	30
271		PDR.00207	Inj. Combipen Vet - 40Lacs	Medicine	54.00	9
272		PDR.00206	Inj. Omenix IV - 40mg	Medicine	90.00	34
273		PDR.00205	Inj. Moxilin Vet -1g	Medicine	103.00	2
274		PDR.00204	Inj. Taxovet - 1g	Medicine	150.00	0
275		PDR.00203	Inj. Topcef - 0.5g	Medicine	98.00	-3
276		PDR.00202	Inj. Eracef -500mg	Medicine	98.00	46
277		PDR.00201	Oral gel Oroconazol - 15g	Medicine	60.00	7
278		PDR.00200	Oint. Lucazol - 10gm	Medicine	100.00	3
279		PDR.00199	Oint. Terbikill - 15g	Medicine	100.00	8
280		PDR.00198	Oint. Dressgel FR Vet - 20g	Medicine	70.00	0
281		PDR.00197	Oint. Trego - 10gm	Medicine	145.00	5
282		PDR.00196	Oint. Dermomix - 15gm	Medicine	200.00	0
283		PDR.00195	Tab. Mycocure - 250mg	Medicine	40.00	16
284		PDR.00194	Tab. Sedil - 5mg	Medicine	2.00	388
285		PDR.00193	Tab. Decason - 0.5mg	Medicine	2.00	92
286		PDR.00192	Cap. Anadol - 50mg	Medicine	8.00	10
287		PDR.00191	Tab. Alatrol - 10mg	Medicine	4.00	63
288		PDR.00190	Tab. Filin - 100mg	Medicine	4.00	0
289		PDR.00189	Tab. Migrex - 200mg	Medicine	10.00	3
290		PDR.00188	Tab. Cortisol - 5mg	Medicine	5.00	140
291		PDR.00187	Tab. Mitaprex - 7.5mg	Medicine	10.00	39
292		PDR.00186	Tab. Vitabion	Medicine	12.00	136
293		PDR.00185	Susp. Emixef PD - 21ML	Medicine	100.00	7
294		PDR.00184	Liq. Fenazol Vet - 100ml	Medicine	170.00	8
295		PDR.00183	Susp. Omastin - 35ml	Medicine	78.00	0
296		PDR.00182	Sol. Tulos - 100ml	Medicine	140.00	0
297		PDR.00181	Susp. Moxilin- 100ml	Medicine	70.00	0
298		PDR.00180	Syp. Nutrum Kids - 100ml	Medicine	90.00	0
299		8941100353288	Susp. Neofloxin -60ml	Medicine	100.00	0
300		PDR.00178	Sol. Periset Oral - 50ml	Medicine	45.00	19
301		PDR.00177	Sol. Cat star - Multivitamin & Coat Tonic	Accessories	490.00	0
302		PDR.00176	Syp. Dirozyl - 60ml	Medicine	35.00	11
303		PDR.00175	Syp. PA Flu Nil - 30ml	Medicine	145.00	0
304		PDR.00174	Susp. Reducid - 50ml	Medicine	50.00	8
305		PDR.00173	Susp. Azin - 15ml	Medicine	95.00	0
306		PDR.00172	Liq. Enrovet - 100ml	Medicine	220.00	5
307		PDR.00171	Syp. Aritone Z - 100ml	Medicine	55.00	0
308		PDR.00170	Susp. Ximeprox PD - 15ML	Medicine	60.00	0
309		PDR.00169	Sol. Cortan - 50 ml	Medicine	65.00	42
310		PDR.00168	Susp. Fenofex - 50ml	Medicine	60.00	0
311		PDR.00167	Susp. Clindacin - 100ml	Medicine	280.00	6
312		PDR.00165	Susp. Fix A - 21ML	Medicine	100.00	25
313		PDR.00135	FIP Test	Diagnostic Test	1,000.00	8
314		PDR.00134	FPV Test - Rapid Test	Diagnostic Test	500.00	11
315		PDR.00126	Microchip	Service	3,000.00	29
316		PDR.00119	Vac DHPPL-With checkup,Pushing,Card re/issue fees	Medicine	1,300.00	15
317		PDR.00118	Vac PCH - with Checkup,Pushing,Card	Medicine	1,300.00	91
318		PDR.00117	Vac Rabies-With checkup,Pushing,Card re/issue fees	Medicine	300.00	175
319		9551017800141	Enrich Champion Cat Litter- Levender - 10L	Accessories	520.00	0
320		6972577016224	Snowcat Cat Litter - 5L - Levender	Accessories	320.00	8
321		PDR.00110	Litter box - Large	Accessories	520.00	16
322		PDR.00109	Cat Carry Bag - Handbag	Accessories	1,850.00	0
323		PDR.00108	Cat Carry Bag - Bagpack	Accessories	1,350.00	11
324		9551017801476	Enrich Champion Cat Litter- Levender - 5L	Accessories	270.00	0
325		9551017801483	Enrich Champion  Cat Litter- Lemon - 5L	Accessories	270.00	0
326		6972577016224	Snowcat Cat Litter - 5L - Lemon	Accessories	320.00	13
327		6972577016422	Maxpet Cat litter - Levenda - 25L	Accessories	1,400.00	0
328		6972577016224	Maxpet Cat litter - Levender - 5L	Accessories	320.00	0
329		9551017800134	Enrich Champion Bentonite Cat Litter- Lemon- 10L	Accessories	520.00	0
330		6972876650549	Shifaa Carbon Bentonite Litter - 10L	Accessories	600.00	62
331		6972577016415	Snowcat Cat Litter - 25L - Levender	Accessories	1,400.00	0
332		6972577016415	Snowcat Cat Litter - 25L - Coffee	Accessories	1,400.00	0
333		6972577016415	Snowcat Cat Litter - 25L - Lemon	Accessories	1,400.00	0
334		PDR.00094	E collar - Elizabeth Collar - Size 2	Accessories	450.00	3
335		PDR.00093	E collar - Elizabeth Collar - Size 4	Accessories	330.00	9
336		PDR.00092	E collar - Elizabeth Collar - Size 7	Accessories	300.00	8
337		PDR.00091	E collar - Elizabeth Collar - Size 5	Accessories	300.00	14
338		PDR.00090	E collar - Elizabeth Collar - Size 6	Accessories	300.00	10
339		PDR.00089	Feeding Kit	Accessories	200.00	22
340		PDR.00088	Scoope Large	Accessories	150.00	53
341		PDR.00087	Thermometer Flexiable	Accessories	380.00	1
342		PDR.00086	Kitten Feeder Small	Accessories	150.00	0
343		PDR.00085	Belt Regular	Accessories	100.00	25
344		PDR.00084	Belt Premium	Accessories	220.00	3
345		PDR.00083	Nail Cutter Plus shaped - Small	Accessories	250.00	11
346		PDR.00082	Belt Febric Premium - M	Accessories	120.00	0
347		PDR.00081	Belt Febric Premium - S	Accessories	120.00	4
348		PDR.00080	Harness open type	Accessories	220.00	9
349		PDR.00079	Jacket Herness - XL	Accessories	270.00	3
350		PDR.00078	Jacket Herness - L	Accessories	270.00	4
351		PDR.00077	Food Bowl Steel	Accessories	220.00	4
352		PDR.00076	Frog Face - Double Bowl	Accessories	440.00	0
353		PDR.00075	Treasure toy - Mouse	Accessories	90.00	0
354		PDR.00074	Cat Toy ball	Accessories	30.00	0
355		PDR.00073	Treasure toy - Plastic & Wire Stick	Accessories	120.00	0
356		PDR.00072	Treasure toy - Thin Stick	Accessories	120.00	0
357		PDR.00071	Treasure toy - Wooden Stick	Accessories	160.00	-1
358		PDR.00069	Treasure toy - Magic stick	Accessories	160.00	6
359		8857101750295	Tab. Helminticide L	Medicine	100.00	267
360		8905045002632	Tab. Kiwof	Medicine	120.00	88
361		8859238500163	Revolution Spot on - 0.75ml	Accessories	1,300.00	0
362		PDR.00065	Frontline Spot on - 0.50ml	Accessories	550.00	10
363		PDR.00064	Frontline Spray - 100ml	Accessories	850.00	3
364		6970117121902	Bioline Ear Mite - 30ml	Accessories	490.00	23
365		8857101750851	Petme Plus Gel - 30g	Medicine	390.00	22
366		8901138507800	Himalaya Erina EP Shampoo - 200ml	Accessories	600.00	11
367		X001LNV5JX	Lime Sulfur Dip - 237ml	Medicine	1,080.00	8
368		8850477007581	Cuties Catz Can - Chicken - 400G	Food	200.00	43
369		8850477000117	Smart Heart Can - Sardine With Chicken in Jelly -	Food	230.00	39
370		8852021015882	Bellotta Can - Real tuna topping chicken in Jelly	Food	220.00	0
371		8720256113744	Truly Grain Free Can - Chicken & Tuna - 95g	Food	180.00	0
372		8720256113737	Truly Grain Free Can - Chicken & Salmon - 95g	Food	180.00	16
373		8850589000708	Bellotta Kitten Pouch - chicken mousse - 65g	Food	90.00	0
374		8850477019713	Smart Heart Pouch- Adult - Tuna in jelly- 85g	Food	90.00	114
375		8850477013278	Smart Heart Pouch- Kitten - Tuna in jelly- 85g	Food	90.00	147
376		6927749871088	Wanpy Creamy Treat - Chicken - 70g	Food	230.00	0
377		8850477007079	Cuties Catz Pouch - Chicken - 75g	Food	90.00	72
378		8850589000975	Bellotta Grain free - Senior- Chicken with whitefi	Food	120.00	0
379		8850589000913	Bellotta Grain free - Indoor- Tuna & Whitefish - 7	Food	120.00	0
380		8850589000951	Bellotta Grain free - Hairball- Tuna & Chicken Jel	Food	120.00	25
381		8850589000937	Bellotta Grain free - Healthy Immune & Multivitami	Food	120.00	4
382		8850589000876	Bellotta Grain free - Baby & Mother- Tuna Mousse -	Food	120.00	0
383		8718692582101	Truly Tuna Sticks Cat treat - 50g	Food	250.00	0
384		6927749871699	Wanpy Meat Broath - Chicken- 50g	Food	100.00	4
385		6927749871729	Wanpy Meat Broath - Salmon & Tuna - 50g	Food	100.00	0
386		6927749871705	Wanpy Meat Broath - Tuna - 50g	Food	100.00	1
387		6927749871682	Wanpy Meat Broath - Chicken, Pumpkin & Carrot - 50	Food	100.00	3
388		8853301550017	Whiskas Pouch Adult - Tuna - 80g	Food	90.00	217
389		8853301550123	Whiskas Pouch Junior - Mackerel - 80g	Food	90.00	0
390		8853301550048	Whiskas Pouch Junior - Tuna - 80g	Food	90.00	0
391		8850238094515	Coco Cat Milk Replacer - 150g	Food	680.00	0
392		8720256113805	Truly Creamy Cat treat - Tuna & Bonito- 70g	Food	230.00	4
393		8720256113782	Truly Creamy Cat treat - Salmon & Codfish- 70g	Food	230.00	4
394		8850477801509	Smart Heart - Chicken,Fish,Egg & Milk - 450 g	Food	360.00	58
395		8850477837508	Smart Heart - Chicken and Tuna - 480 g	Food	360.00	99
396		8850477837157	Smart Heart - Chicken and Tuna - 1.2 kg	Food	790.00	42
397		8859764100776	Dog Harness	Accessories	650.00	0
398		8850477801158	Smart Heart - Chicken,Fish,Egg & Milk - 1.1 kg	Food	790.00	31
399		PDR.00023	Mixed Cat food - 300g	Food	160.00	8
400		8850477837355	Smart Heart - Chicken and Tuna - 3.0 kg	Food	1,650.00	34
401		6936363902689	Cuties Catz - Chicken & Tuna - 350g	Food	200.00	100
402		8681299602049	Jungle Adult - Chicken and Fish - 1.5kg	Food	840.00	17
403		8681299602537	Jungle Kitten - Chicken - 500g	Food	360.00	0
404		8681299603619	Jungle Kitten - Chicken - 1.5 kg	Food	840.00	7
405		8681299606641	Felicia Urinary Care - 2.0 kg	Food	1,450.00	0
406		9310022866500	whiskas Adult - Tuna- 480	Food	380.00	0
407		8681299601851	Jungle Adult - Salmon - 500g	Food	360.00	16
408		8681299602544	Jungle Adult - Lamb - 500g	Food	360.00	1
409		8681299601875	Jungle Adult - Chicken and fish - 500g	Food	360.00	0
410		8853301001939	whiskas Junior - Mackerel - 1.1 g	Food	790.00	0
411		8853301400114	whiskas Hairball control - Chicken and tuna- 1.1 g	Food	790.00	0
412		8681692100227	Paw Paw adult Cat food- Chicken - 1.0 kg	Food	480.00	33
413		6927749825104	Wanpy Grain Free - Chicken - 1.5 kg	Food	1,350.00	4
`;

function parseTable(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  // find header line index (contains words like 'Code' and 'Name')
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (l.includes('code') && l.includes('name')) { start = i + 1; break; }
  }

  const rows = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    // split on tabs first; if no tabs, fall back to multiple spaces
    let cols = line.split('\t').map(c => c.trim()).filter(() => true);
    if (cols.length === 1) {
      cols = line.split(/\s{2,}/).map(c => c.trim());
    }
    // mapping heuristics:
    // if there are 7+ columns: [#, image?, code, name, category, sell, stock]
    // if 6 columns: [#, code, name, category, sell, stock]
    let code, name, category, sell, stock;
    if (cols.length >= 7) {
      code = cols[2] || '';
      name = cols[3] || '';
      category = cols[4] || '';
      sell = cols[5] || '';
      stock = cols[6] || '';
    } else if (cols.length === 6) {
      code = cols[1] || '';
      name = cols[2] || '';
      category = cols[3] || '';
      sell = cols[4] || '';
      stock = cols[5] || '';
    } else {
      // best-effort: try to pick last 3 tokens as category, sell, stock
      const toks = line.split(/\t|\s{2,}/).map(s => s.trim()).filter(Boolean);
      if (toks.length >= 5) {
        code = toks[1];
        name = toks.slice(2, toks.length - 3 + 2).join(' ');
        category = toks[toks.length - 3];
        sell = toks[toks.length - 2];
        stock = toks[toks.length - 1];
      } else {
        continue; // skip if cannot parse
      }
    }

    // normalize price and stock
    const price = parseFloat(String(sell).replace(/[,\s]/g, '')) || 0;
    let stockNum = parseInt(String(stock).replace(/[^-0-9]/g, ''), 10);
    if (Number.isNaN(stockNum)) stockNum = 0;

    rows.push({ code: code || '', name: name || '', category: category || 'Others', price, stock: stockNum });
  }

  // assign sequential ids
  return rows.map((r, idx) => ({ id: idx + 1, ...r }));
}

export const products = parseTable(rawTable);

export const categoryEmoji = {
  Food: '🍖',
  Accessories: '🧸',
  Medicine: '💊',
  Service: '🛎️',
  'Diagnostic Test': '🧪',
  Surgery: '🔪',
  Others: '📦',
};

export default products;
