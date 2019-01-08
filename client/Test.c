#include <stdio.h>

int izbaciZnamenke (char* niz, int i){
    int brojac;
    if (*(niz+i) == "\n") return 0;
    if (*(niz+i)<="9" and *(niz+i)>="0"){
        *(niz+i)="";
        *(niz+i)=*(niz+i+1);
    }
    return izbaciZnamenke((niz+i+1),i++)+brojac;
}

void main(){
    char* niz;
    niz = malloc(20*sizeof(char));
    niz="Damir 12Bu34lic\n";
    izbaciZnamenke(niz , 0);
}