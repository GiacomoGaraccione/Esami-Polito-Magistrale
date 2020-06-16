
;template base per una funzione assembly da inserire nel codice ARM
;va inserita nella stessa cartella del modulo che andrà a richiamarla (RIT se chiamata da pressione di Select, Timer se deve scattare al termine di un timer, ...)
;nel file .c che la richiama va dichiarata come "extern unsigned int funct(lista parametri)
;se il numero di registri da usare è basso usare magari quelli volatili

				AREA asm_functions, CODE, READONLY				
                EXPORT  funct
funct
				; save current SP for a faster access 
				; to parameters in the stack
				MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
				; extract argument 4 and 5 into R4 and R5
				;LDR   r4, [r12]
				;LDR   r5, [r12,#4]
				; setup a value for R0 to return
				;MOV	  r0, r5
				
				
				; restore volatile registers
     			LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END